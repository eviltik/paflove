AFRAME.registerComponent('vr-controllers', {
    
    schema:{
        rotate_thumbstick_angle_min: { default:0.23, type:"number" },

    },

    init: function () {

        this.playerEl = document.querySelector('#player');
        this.player = null;
                
        // precompiled regular expression to fetch for right hand (ev.target.id)
        this.reRightHand = new RegExp('right','i');

        this.onRenderStart = AFRAME.utils.bind(this.onRenderStart, this);
        this.onControllerConnected = AFRAME.utils.bind(this.onControllerConnected, this);
        this.onButtonUp = AFRAME.utils.bind(this.onButtonUp, this);
        this.onButtonDown = AFRAME.utils.bind(this.onButtonDown, this);
        this.onButtonChanged = AFRAME.utils.bind(this.onButtonChanged, this);
        this.onAxisMove = AFRAME.utils.bind(this.onAxisMove, this);

        this.el.sceneEl.addEventListener('renderstart', this.onRenderStart);
        this.installListeners();

    },

    onRenderStart: function() {

        //AFRAME.log('vr-controllers:onRenderStart');
        this.player = this.playerEl.components.player;

    },

    installListeners: function () {

        AFRAME.log('vr-controllers:installListeners');
        this.el.addEventListener("controllerconnected", this.onControllerConnected, false);
        this.el.addEventListener("axismove", this.onAxisMove, false);
        this.el.addEventListener("buttonchanged", this.onButtonChanged, false);

    },

    onControllerConnected: function (ev) {

        AFRAME.log('onControllerConnected '+ev.target.id);

    },

    onAxisMove: function (ev) {

        AFRAME.log('onAxisMove')

        if (!ev.target.id.match(this.reRightHand)) {
            return;
        }
        
        this.thumbstickDistanceX = ev.detail.axis[2];
        this.thumbstickDistanceY = ev.detail.axis[3];

        AFRAME.log(`rotate: thumbstickDistanceX=${this.thumbstickDistanceX} `);
        AFRAME.log(`rotate: thumbstickDistanceY=${this.thumbstickDistanceY} `);

        if (Math.abs(this.thumbstickDistanceX) > this.data.rotate_thumbstick_angle_min) {
            this.player.rotate(this.thumbstickDistanceX);
        }

        if (Math.abs(this.thumbstickDistanceY) > this.data.rotate_thumbstick_angle_min) {
            this.player.moveUpOrDown(this.thumbstickDistanceY);
        }

    },
    
    onButtonUp: function (ev) {

        AFRAME.log('onButtonUp');

    },

    onButtonDown: function (ev) {

        console.log('onButtonDown', this, ev);
        AFRAME.log('onButtonDown');
        
    },

    onButtonChanged: function (ev) {
            
        if ( !ev || !ev.detail ) {
            return;
        }

        AFRAME.log('onButtonChanged: id' + ev.detail.id);
        AFRAME.log('onButtonChanged: state.value=' + ev.detail.state.value);

        const OCULUS_BUTTON_TRIGGER = 0;

        if (ev.detail.id === OCULUS_BUTTON_TRIGGER) {
            
            if (ev.detail.state) {
                if (ev.detail.state.value > 0.20) {
                    this.player.startShooting();
                } else {
                    this.player.stopShooting();
                }
            }
        }
    }

});