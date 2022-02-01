AFRAME.registerComponent('hdri', {

    schema: {
        path: {type:'string', default: '/3d/textures/hdri/'},
        fileId: {type: 'string', default: 'spiaggia_di_mondello'}, // file without end "_4k.hdr"
        resolution: {type:'string', default:'4k'},
        extension: {type:'string', default:'.hdr'}
    },


    init: function () {

        this.sanityChecks();
        //this.el.sceneEl.addEventListener('loaded', AFRAME.utils.bind(this.loadHDRI, this));
        this.loadHDRI();

    },

    initRenderer: function() {

        /*
        THREE.NoToneMapping
        THREE.LinearToneMapping // the best one for gltf blender export
        THREE.ReinhardToneMapping
        THREE.CineonToneMapping
        THREE.ACESFilmicToneMapping
        */

        this.el.sceneEl.renderer.toneMapping = THREE.CineonToneMapping;
        this.el.sceneEl.renderer.toneMappingExposure = 0.5;
        this.el.sceneEl.renderer.outputEncoding = THREE.sRGBEncoding;

    },

    sanityChecks: function () {
        
        const allowedResolutions = ['1k', '2k', '3k', '4k'];
        const allowedExtensions = ['.hdr'];

        if (!allowedResolutions.includes(this.data.resolution)) {
            throw new Error('hdri: expected resolutions: '+JSON.stringify(allowedResolutions));
        }

        if (!allowedExtensions.includes(this.data.extension)) {
            throw new Error('hdri: expected extensions: '+JSON.stringify(allowedExtensions));
        }

    },

    getFilename:function () {
        
        return `${this.data.fileId}_${this.data.resolution}${this.data.extension}`;

    },

    loadHDRI() {

        this.initRenderer();

        const scene = this.el.object3D;
        const path = this.data.path;
        const filename = this.getFilename();

        AFRAME.log(`hdri: loadHDRI: ${path}${filename}`);
        
        this.loader = new THREE.RGBELoader()
            .setPath( path )
            .load( filename, ( texture ) => {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                scene.background = texture;
                //scene.environment = texture;

            } );


        
    },

    onRenderStart: function () {
        console.log('boot:onRenderStart');
        AFRAME.log('boot:onRenderStart');
    }
});