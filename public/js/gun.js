
AFRAME.registerComponent('gun', {
    
    multiple: true,

    schema:{
        model:{
            default:'m16',
            type:'string'
        },
        leftHanded:{
            default:false,
            type:'boolean'
        },
        reparentScreen:{
            default:'#gunContainerScreen',
            type:'string'
        },
        reparentVR:{
            default:'#gunContainerVR',
            type:'string'
        }
    },

    guns:{
        'm16':{
            modelType:'obj-model',
            modelSrc:"obj: #m16-obj; mtl: #m16-mtl",
            positionScreenRight:'0.3 -0.3 -0.5',
            rotationScreenRight:'0 0 0',
            positionVRRight:'-0.005 -0.58 -0',
            rotationVRRight:'0 -80 -45',
            scale:"0.01 0.01 0.01",
        },
        'm16-2':{
            modelType:'gltf-model',
            modelSrc:"#m16-glb",
            positionScreenRight:'0.15 -0.3 -0.40',
            rotationScreenRight:'0 0 0',
            positionVRRight:'-0.005 0.58 -0',
            rotationVRRight:'0 -10 -45',
            scale:"0.01 0.01 0.01"
        }
    },

    init: function () {

        if (AFRAME.gunLoaded) {
            return;
        }

        AFRAME.gunLoaded = true;

        this.gun = null;
        this.onEnterVR = AFRAME.utils.bind(this.onEnterVR, this);
        this.onExitVR = AFRAME.utils.bind(this.onExitVR, this);
        this.reparent = AFRAME.utils.bind(this.reparent, this);
        this.reparentForScreen = AFRAME.utils.bind(this.reparentForScreen, this);
        this.reparentForVR = AFRAME.utils.bind(this.reparentForVR, this);
        this.displayForScreen = AFRAME.utils.bind(this.displayForScreen, this);
        this.displayForVR = AFRAME.utils.bind(this.displayForVR, this);

        this.el.sceneEl.addEventListener('renderstart', this.onLoaded);
        this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
        this.el.sceneEl.addEventListener('exit-vr', this.onExitVR);

        this.immersive = false;
        this.gunContainerScreen = document.querySelector(this.data.reparentScreen);
        this.gunContainerVR = document.querySelector(this.data.reparentVR);

        this.showGun(this.data.model);
        this.displayForScreen();

    },


    showGun: function(gunId) {

        console.log('gun: showGun', gunId);

        this.gun = this.guns[gunId];
        if (!this.gun) {
            throw new Error('gun:loadGun: unknow gun id'+gunId);
        }
2
        this.el.setAttribute(this.gun.modelType, this.gun.modelSrc);
        this.el.setAttribute('scale', this.gun.scale);
        this.el.setAttribute('position', this.gun.positionScreenRight);
        this.el.setAttribute('rotation', this.gun.rotationScreenRight);

    },

    reparent: function(el, newParent, newPosition, newRotation) {

        newPosition = AFRAME.utils.coordinates.parse(newPosition);
        newRotation = AFRAME.utils.coordinates.parse(newRotation);

        // credits: https://stackoverflow.com/questions/65538916/aframe-reparenting-an-element-keeping-its-world-position-rotation
        console.log('gun:reparent', el, newParent, newPosition, newRotation);

        // Attach the object3D to the new parent, to get position, rotation, scale

        newParent.object3D.attach(el.object3D);
        let newScale = el.object3D.scale;
      
        // Create new element, copy the current one on it
        let newEl = document.createElement(el.tagName);
        if (el.hasAttributes()) {
            let attrs = el.attributes;
            for (let i = attrs.length - 1; i >= 0; i--) {
                let attrName = attrs[i].name;
                let attrVal = el.getAttribute(attrName);
                console.log('reparent: setAttribute', attrName, attrVal);
                newEl.setAttribute(attrName, attrVal);
            }
        }
        
        // Listener for location, rotation,... when the new el is laded
        function relocate() {
            console.log('gun:relocate', newPosition, newRotation, newScale);
            newEl.object3D.position = newPosition;
            newEl.object3D.rotation = newRotation;
            newEl.object3D.scale = newScale;
        }

        newEl.addEventListener('loaded', relocate, {'once': true});
        newParent.appendChild(newEl);
        el.parentEl.removeChild(this.el);

        this.el = newEl;

        //const laser = document.createElement('a-entity');
        //laser.setAttribute('raycaster', 'showLine: true; far: 100; lineColor: red; lineOpacity: 0.5;');
        //newEl.appendChild(laser);
          
    },

    onLoaded: function () {

        console.log('gun:onLoaded');
        AFRAME.log('gun:onLoaded');

    },

    reparentForScreen() {

        this.reparent(this.el, this.gunContainerScreen, this.gun['positionScreenRight'], this.gun['rotationScreenRight']);

    },

    reparentForVR() {

        this.reparent(this.el, this.gunContainerVR, this.gun['positionVRRight'], this.gun['rotationVRRight']);

    },

    displayForScreen: function() {
        
        if (this.el.getObject3D('mesh')) {
            console.log('gun:displayForScreen: object is a mesh');
            this.reparentForScreen();
        } else {
            console.log('gun:displayForScreen: object is not a mesh, using object3dset listener');
            this.el.sceneEl.addEventListener('object3dset', this.reparentForScreen, {'once': true});
        }

    },

    displayForVR: function() {

        console.log('gun:displayForVR', this.positionVR, this.rotationVR);

        this.positionScreen = AFRAME.utils.coordinates.parse(gun.positionScreenRight);
        this.rotationScreen = AFRAME.utils.coordinates.parse(gun.rotationScreenRight);
        this.positionVR = AFRAME.utils.coordinates.parse(gun.positionVRRight);
        this.rotationVR = AFRAME.utils.coordinates.parse(gun.rotationVRRight);

        if (this.el.getObject3D('mesh')) {
            this.reparentForVR();
        } else {
            this.el.sceneEl.addEventListener('object3dset', this.reparentForVR, {'once': true});
        }

    },

    onEnterVR: function () {

        console.log('gun:onEnterVR');
        this.immersive = true;
        this.displayForVR();

    },

    onExitVR: function () {

        console.log('gun:onExitVR');
        this.immersive = false;
        this.displayForScreen();

    }
});