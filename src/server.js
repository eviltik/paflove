const connect = require( 'connect' );
const https = require( 'https' );
const cookieSession = require( 'cookie-session' );
const bodyParser = require( 'body-parser' );
const serveStatic = require( 'serve-static' );
const pem = require( 'pem' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const log = require( './logger.js' );
const open = require( 'open' );
const networkInterfaces = require( 'os' ).networkInterfaces;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function getIpAddress() {

    const nets = networkInterfaces();
    let ip;

    for ( const name of Object.keys( nets ) ) {
        for ( const net of nets[name] ) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if ( net.family === 'IPv4' && !net.internal && name.match( /wi-fi|eth0/i ) ) {
                ip = net.address;
            }
        }
    }

    if ( !ip ) {
        throw new Error( 'Could not fetch Wi-Fi IP Address' );
    }

    return ip;
}

function getPackageName() {

    const packageJsonFile = path.resolve( __dirname,'..', 'package.json' );
    log.info( `getPackageName: reading ${packageJsonFile}` );
    return fs.readJsonSync( packageJsonFile ).name;

}

function getHome() {
    
    let home = process.env.APPDATA || ( process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share' );
    home = path.join( home, getPackageName() );
    log.info( `getHome: using path ${home}` );
    fs.ensureDirSync( home );
    return home;

}

function generateSSLCertificates( callback ) {

    log.info( 'generateSSLCertificates: generating new self signed SSL Certificates ...' );

    pem.createCertificate( { days: 365, selfSigned: true }, ( err, keys ) => {
        
        if ( err ) {
            throw err;
        }

        const opts = {};
        opts.key = keys.serviceKey;
        opts.cert = keys.certificate;
        callback( null, opts );

    } );

}

function readCertificates( options, callback ) {

    const homePath = getHome();
    const fileKey = path.join( homePath, 'certs', 'server.key' );
    const fileCrt = path.join( homePath, 'certs', 'server.crt' );
    //const fileCa = path.join( homePath, 'certs', 'ca.crt' );

    try {

        //log.info( `readCertificates: reading self signed private key ${fileKey}` );
        //log.info( `readCertificates: reading self signed certificate ${fileCrt}` );

        options.key = fs.readFileSync( fileKey );
        options.cert = fs.readFileSync( fileCrt );
        //options.ca = fs.readFileSync( fileCa );

    } catch( e ) {
        // file can not be read or does not exists
    }

    
    if ( !options.key || !options.cert ) {

        fs.ensureDirSync( path.join( homePath, 'certs') );

        generateSSLCertificates( ( err, opts ) => {

            log.info( `readCertificates: writing self signed private key ${fileKey}` );
            log.info( `readCertificates: writing self signed certificate ${fileCrt}` );

            fs.writeFileSync( fileKey, opts.key.toString() );
            fs.writeFileSync( fileCrt, opts.cert.toString() );
            options.key = opts.key;
            options.cert = opts.cert;
            callback();
        } );

    } else {

        log.info( `readCertificates: using self signed private key ${fileKey}` );
        log.info( `readCertificates: using self signed certificate ${fileCrt}` );

        callback();

    }
            

}

function start( port, callback ) {
    
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
    const docRoot = path.join( __dirname, '..', 'public' );
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
    
    function serverStart() {
        
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
    }

    readCertificates( serverOptions, serverStart );


}

module.exports = {
    start
};

