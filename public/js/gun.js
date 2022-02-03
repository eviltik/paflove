
AFRAME.registerComponent('gun', {
    
    multiple: false,

    schema:{
        model:{
            default:'m16',
            type:'string'
        },
        leftHanded:{
            default:false,
            type:'boolean'
        },
        positionScreenRight:{
            default:'0.3 -0.3 -0.5',
            type:'string'
        },
        rotationScreenRight:{
            defaut:'0 -90 0',
            type:'string'
        },
        positionVRRight:{ 
            default:'-0.005 -0.58 -0',
            type:'string'
        },
        rotationVRRight:{ 
            default:'0 -80 -45',
            type:'string'
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

    init: function () {

        if (AFRAME.gunLoaded) return;

        AFRAME.gunLoaded = true;

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

        this.loadGun(this.data.model);

        this.immersive = false;
        this.gunContainerScreen = document.querySelector(this.data.reparentScreen);
        this.gunContainerVR = document.querySelector(this.data.reparentVR);

        if (this.data.leftHanded) {

            this.positionScreen = AFRAME.utils.coordinates.parse(this.data.positionScreenLeft);
            this.rotationScreen = AFRAME.utils.coordinates.parse(this.data.rotationScreenLeft);
            this.positionVR = AFRAME.utils.coordinates.parse(this.data.positionVRLeft);
            this.rotationVR = AFRAME.utils.coordinates.parse(this.data.rotationVRLeft);

        } else {

            this.positionScreen = AFRAME.utils.coordinates.parse(this.data.positionScreenRight);
            this.rotationScreen = AFRAME.utils.coordinates.parse(this.data.rotationScreenRight);
            this.positionVR = AFRAME.utils.coordinates.parse(this.data.positionVRRight);
            this.rotationVR = AFRAME.utils.coordinates.parse(this.data.rotationVRRight);
        
            console.log(this.rotationScreen);
        }

        console.log('init');
        this.displayForScreen();

    },

    loadGun: function(gunId) {

        console.log('gun: loadGun', gunId);

        if (gunId === 'm16') {
            this.el.setAttribute('obj-model',"obj: #m16-obj; mtl: #m16-mtl");
            this.el.setAttribute('scale', "0.01 0.01 0.01");
        } else if (gunId === 'm16-2') {
            this.el.setAttribute('gltf-model',"#m16-glb");
            this.el.setAttribute('scale', "0.01 0.01 0.01");
        } else {
            throw new Error('gun:loadGun: error, only m16 is implemented');
        }

    },

    reparent: function(el, newParent, newPosition, newRotation) {

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
            newEl.object3D.location = newPosition;
            newEl.object3D.rotation = newRotation;
            newEl.object3D.scale = newScale;
        }

        newEl.addEventListener('loaded', relocate, {'once': true});
        newParent.appendChild(newEl);
        el.parentEl.removeChild(this.el);

        this.el = newEl;
          
    },

    onLoaded: function () {

        console.log('gun:onLoaded');
        AFRAME.log('gun:onLoaded');

    },

    reparentForScreen() {

        this.reparent(this.el, this.gunContainerScreen, this.positionScreen, this.rotationScreen);
        this.el.setAttribute('position', this.positionScreen);
        this.el.setAttribute('rotation', this.rotationScreen);

    },

    reparentForVR() {

        this.reparent(this.el, this.gunContainerVR, this.positionVR, this.rotationVR);
        this.el.setAttribute('position', this.positionVR);
        this.el.setAttribute('rotation', this.rotationVR);

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