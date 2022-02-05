AFRAME.registerComponent('handle-vr', {
    
    multiple:true, 
    
    schema:{
        rotate_thumbstick_angle_min: { default:0.23, type:"number" },

    },

    init: function () {

        this.playerEl = document.querySelector('#player');
        this.player = null;
                
        // precompiled regular expression to fetch for right hand (ev.target.id)
        this.isRightHand = this.el.id.match(/right/i);
        if (this.isRightHand) {
            this.handName = 'right';
        } else {
            this.handName = 'left';
        }

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

        AFRAME.log(`handle-vr: ${this.handName}: onRenderStart`);
        this.player = this.playerEl.components.player;

    },

    installListeners: function () {

        AFRAME.log(`handle-vr: ${this.handName}: installListeners`);

        this.el.addEventListener("controllerconnected", this.onControllerConnected, false);
        this.el.addEventListener("buttonchanged", this.onButtonChanged, false);

        if (this.isRightHand) {
            this.el.addEventListener("axismove", this.onAxisMove, false);
        }

    },

    onControllerConnected: function (ev) {

        AFRAME.log(`handle-vr: ${this.handName}: onControllerConnected ${ev.target.id}`);

    },

    onAxisMove: function (ev) {

        AFRAME.log(`handle-vr: ${this.handName}: onAxisMove ${ev.target.id}`);

        this.thumbstickDistanceX = ev.detail.axis[2];
        this.thumbstickDistanceY = ev.detail.axis[3];

        if (Math.abs(this.thumbstickDistanceX) > this.data.rotate_thumbstick_angle_min) {
            this.player.rotate(this.thumbstickDistanceX);
        }

        if (Math.abs(this.thumbstickDistanceY) > this.data.rotate_thumbstick_angle_min) {
            this.player.moveUpOrDown(this.thumbstickDistanceY);
        }

    },
    
    onButtonUp: function (ev) {

        AFRAME.log(`handle-vr: ${this.handName}: onButtonUp ${ev.target.id}`);

    },

    onButtonDown: function (ev) {

        AFRAME.log(`handle-vr: ${this.handName}: onButtonDown ${ev.target.id}`);
        
    },

    onButtonChanged: function (ev) {

        if ( !ev || !ev.detail ) {
            return;
        }

        AFRAME.log(`handle-vr: ${this.handName}: onButtonChanged el=${ev.target.id}, id=${ev.detail.id}, state.value=${ev.detail.state.value}`);

        const OCULUS_BUTTON_TRIGGER = 0;
        const OCULUS_BUTTON_STICK = 3;

        if (this.isRightHand) {
            if (ev.detail.id === OCULUS_BUTTON_TRIGGER) {
                if (ev.detail.state) {
                    if (ev.detail.state.value > 0.20) {
                        this.player.startShooting();
                    } else {
                        this.player.stopShooting();
                    }
                }

            }
        } else {
            if (ev.detail.id === OCULUS_BUTTON_STICK) {
                if (ev.detail.state.value === 0) {
                    this.player.stopRunning();
                } else {
                    this.player.startRunning();
                }
            }

        }
    }

});