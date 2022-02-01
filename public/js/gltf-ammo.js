AFRAME.registerComponent('gltf-ammo', {
    
    schema: {
        model: {default: ''},
        body: {type: 'string', default: 'static'}, //dynamic: A freely-moving object.
        shape: {type: 'string', default: 'hull'}, // hull: Wraps a model in a convex hull, like a shrink-wrap
    },

    init: function () {

        const gltfmodel = document.createElement('a-entity')
        this.el.appendChild(gltfmodel)
        gltfmodel.setAttribute('gltf-model', this.data.model)
        gltfmodel.setAttribute('shadow', {receive: false})
  
        // Specify what type of ammo-body (dynamic, static, kinematic)
        gltfmodel.setAttribute('ammo-body', {type: this.data.body})
  
        // Waiting for model to load before adding ammo-shape (box, cylinder, sphere, capsule, cone, hull)
        this.el.addEventListener('model-loaded', () => {
            gltfmodel.setAttribute('ammo-shape', {type: this.data.shape})
        })

    },

});