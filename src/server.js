import connect from 'connect';
import https from 'https';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import pem from 'pem';
import path from 'path';
import fs from 'fs-extra';
import log from './logger.js';
import open from 'open';
import { networkInterfaces } from 'os';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const getIpAddress = () => {
    const nets = networkInterfaces();
    let ip;

    for ( const name of Object.keys( nets ) ) {
        for ( const net of nets[name] ) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if ( net.family === 'IPv4' && !net.internal ) {
                // Accept more interface names: wi-fi, eth0, enp*, wlan*, etc.
                if ( name.match( /wi-fi|wlan|eth|enp|ens|eno/i ) ) {
                    ip = net.address;
                    break;
                }
            }
        }
        if (ip) break;
    }

    // Fallback: if no specific interface found, use any non-internal IPv4
    if ( !ip ) {
        for ( const name of Object.keys( nets ) ) {
            for ( const net of nets[name] ) {
                if ( net.family === 'IPv4' && !net.internal ) {
                    ip = net.address;
                    break;
                }
            }
            if (ip) break;
        }
    }

    if ( !ip ) {
        throw new Error( 'Could not fetch IP Address' );
    }

    return ip;
};

const getPackageName = () => {
    const packageJsonFile = path.resolve( new URL('.', import.meta.url).pathname, '..', 'package.json' );
    log.info( `getPackageName: reading ${packageJsonFile}` );
    return fs.readJsonSync( packageJsonFile ).name;
};

const getHome = () => {
    let home = process.env.APPDATA || ( process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share' );
    home = path.join( home, getPackageName() );
    log.info( `getHome: using path ${home}` );
    fs.ensureDirSync( home );
    return home;
};

const generateSSLCertificates = async () => {
    log.info( 'generateSSLCertificates: generating new self signed SSL Certificates ...' );

    return new Promise((resolve, reject) => {
        pem.createCertificate( { days: 365, selfSigned: true }, ( err, keys ) => {
            if ( err ) {
                reject(err);
                return;
            }

            const opts = {};
            opts.key = keys.serviceKey;
            opts.cert = keys.certificate;
            resolve( opts );
        });
    });
};

const readCertificates = async ( options ) => {
    const homePath = getHome();
    const fileKey = path.join( homePath, 'certs', 'server.key' );
    const fileCrt = path.join( homePath, 'certs', 'server.crt' );

    try {
        options.key = fs.readFileSync( fileKey );
        options.cert = fs.readFileSync( fileCrt );
    } catch( e ) {
        // file can not be read or does not exists
    }

    if ( !options.key || !options.cert ) {
        fs.ensureDirSync( path.join( homePath, 'certs') );

        const opts = await generateSSLCertificates();

        log.info( `readCertificates: writing self signed private key ${fileKey}` );
        log.info( `readCertificates: writing self signed certificate ${fileCrt}` );

        fs.writeFileSync( fileKey, opts.key.toString() );
        fs.writeFileSync( fileCrt, opts.cert.toString() );
        options.key = opts.key;
        options.cert = opts.cert;
    } else {
        log.info( `readCertificates: using self signed private key ${fileKey}` );
        log.info( `readCertificates: using self signed certificate ${fileCrt}` );
    }
};

const start = async ( port, callback ) => {
    const serverOptions = {};
    const app = connect();

    // store session state in browser cookie
    app.use( cookieSession( {
        keys: ['lksdjfazdlk', 'xklcvjlxckjv']
    } ) );

    // parse urlencoded request bodies into req.body
    app.use( bodyParser.urlencoded( {
        extended: false
    } ) );
    
    // static files
    const docRoot = path.join( new URL('.', import.meta.url).pathname, '..', 'public' );
    log.info( `Start: using docroot ${docRoot} ` );

    const serve = serveStatic(
        docRoot,
        {
            index: [
                'index.html',
                'index.htm'
            ]
        }
    );

    app.use( serve );
    
    const serverStart = () => {
        const ip = getIpAddress();
        log.info( `Webserver starting on ${ip}:${port}` );

        serverOptions.port = port;

        const server = https
            .createServer( serverOptions, app )
            .listen( serverOptions.port, ip );

        const url = `https://${ip}:${serverOptions.port}`;
        log.info( `webserver ready, opening window browser on ${url}` );
        open( `${url}` );

        callback && callback( null, server );
    };

    await readCertificates( serverOptions );
    serverStart();
};

export { start };

