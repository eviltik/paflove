AFRAME.registerComponent('player', {
    
    multiple: false,

    schema: {

        // player rotation
        player_rotate_thumbstick_angle_min: { default:0.23, type:"number" },
        player_rotate_angle: { default:(Math.PI/6), type:"number" },
        player_rotate_pause_ms: { default:200, type:"int" },
        player_translate_vertical: { default:0.2, type:"number" },

    },

    init: function () {

        // aframe objects
        this.player = document.querySelector("#player");
        this.gunsound = document.querySelector('#gunsound');
        this.gun = document.querySelector('#gun');

        // player status
        this.status = {
            rotating:false,
            shooting:false
        }

        // public methods
        this.startShooting = AFRAME.utils.bind(this.startShooting, this);
        this.stopShooting = AFRAME.utils.bind(this.stopShooting, this);
        this.shooting = AFRAME.utils.bind(this.shooting, this);
        this.rotate = AFRAME.utils.bind(this.rotate, this);

        this.FLY_MODE = false;

    },

    startShooting: function () {
        
        if (this.status.shooting) return;

        //console.log('start shooting', Date.now());
        //AFRAME.log('start shooting '+Date.now());
        
        this.status.shooting = true;
        this.shooting();
        this.shooterInterval = setInterval(this.shooting, 90);
        this.gun = document.querySelector('#gun');
    },

    stopShooting: function () {

        if (!this.status.shooting) return;

        //AFRAME.log('player:stopShooting');
        
        this.status.shooting = false;
        clearInterval(this.shooterInterval);
        
    },

    shooting: function() {

        AFRAME.log('player:shooting');
        this.gunsound.components.sound.playSound();
        //this.gun.setAttribute('animation',"property: rotation; to: 0 0 1; loop: false; dur: 100");

    },

    setRandomLocation: function (min, max) {
    
        if (!this.player) {
            throw new Error('Could not set player random location, #player not found');
        }

        const newNocation = {

            // random X
            x: this.getRandomInt(min, max),

            // for now, setRandomLocation only called in immersive mode, so
            // rather than 1.6 as defined initialy in index.html, 
            // switching immersive mode set the camera to 1.6 or something 
            // automatically. So we MUST set 0 here.
            y: 0,

            // random Y
            z: this.getRandomInt(min, max)

        }

        // we don't care about speed here (setAttribute is supposed to be slow)
        this.player.setAttribute('position', newNocation);
    
    },

    rotate: function (thumbstickDistanceX) {

        if (this.status.rotating)  {
            return;
        }

        AFRAME.log(`rotate: thumbstickDistanceX=${thumbstickDistanceX} `);

        this.rotateStart(thumbstickDistanceX);

    },

    moveUpOrDown: function(thumbstickDistanceY) {

        AFRAME.log('moveUpOrDown');

        if ( thumbstickDistanceY > 0 ) {
            // move up
            this.player.object3D.position.y +=-this.data.player_translate_vertical;
        } else {
            // move down
            this.player.object3D.position.y += this.data.player_translate_vertical;
        }

    },

    rotateStart: function (thumbstickDistanceX) {

        AFRAME.log('rotateStart');

        this.status.rotating = true;
        
        if ( thumbstickDistanceX > 0 ) {
            // rotate left
            this.player.object3D.rotation.y += -this.data.player_rotate_angle;
        } else {
            // rotate right
            this.player.object3D.rotation.y += this.data.player_rotate_angle;
        }

        setTimeout(
            this.rotateStop.bind(this),
            this.data.player_rotate_pause_ms
        );

    },

    rotateStop: function () {

        this.status.rotating = false;

    },

    getRandomInt: function (min, max) {

        min = Math.ceil( min );
        max = Math.floor( max );
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;

    }
});

