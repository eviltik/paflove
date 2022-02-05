AFRAME.registerComponent('loadmap', {
    
    schema: {
        model: {default: ''},
        body: {type: 'string', default: 'static'}, //[static, dynamic]: A freely-moving object.
        shape: {type: 'string', default: 'hull'}, // hull: Wraps a model in a convex hull, like a shrink-wrap
        navmesh:{type:'string', default: null} // [only]
    },

    init: function () {

        const gltfmodel = document.createElement('a-entity');
        this.el.appendChild(gltfmodel);
        gltfmodel.setAttribute('gltf-model', this.data.model);
        //gltfmodel.setAttribute('shadow', {receive: true});
        gltfmodel.setAttribute('nav-mesh');

        // Specify what type of ammo-body (dynamic, static, kinematic)
        gltfmodel.setAttribute('ammo-body', {type: this.data.body});
  
        // Waiting for model to load before adding ammo-shape (box, cylinder, sphere, capsule, cone, hull, mesh)
        
        const showNavMeshOnly = this.data.navmesh === 'only';

        this.el.addEventListener('model-loaded', (ev) => {
        
            ev.detail.model.traverse( function( node ) {

                console.log('loadmap: traversing ',node.name);

                if ( !node.material ) return;

                if ( node.name === 'navmesh' ) {
                    
                    //node.material.transparent = true;
                    //node.material.opacity = 0.5;
                    
                    if ( showNavMeshOnly ) {

                        node.material.visible = true;

                    } else {

                        node.material.visible = false;

                    }

                } else if ( node.isMesh ) {

                    if ( showNavMeshOnly ) {
                        node.material.visible = false;
                    }

                    if ( node.material.map ) {
                        node.material.map.anisotropy = 16;
                    }

                    //node.castShadow = true;
                    //node.receiveShadow = true;

                }
        
            } );
        
            gltfmodel.setAttribute('ammo-shape', {type: this.data.shape});
            /*
            setTimeout(() => {
                document.querySelector('#player').components['movement-controls'].updateNavLocation();
            }, 500);
            */
        })

        // # https://github.com/n5ro/aframe-physics-system/issues/200

    },

});