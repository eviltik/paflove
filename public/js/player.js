AFRAME.registerComponent('player', {
    
    multiple: false,

    schema: {

        // player rotation
        player_rotate_thumbstick_angle_min: { default:0.25, type:"number" },
        player_rotate_angle: { default:(Math.PI/6), type:"number" },
        player_rotate_pause_ms: { default:230, type:"int" },
        player_translate_vertical: { default:0.1, type:"number" },

    },

    init: function () {

        // aframe objects
        this.player = document.querySelector("#player");
        this.gunsound = document.querySelector('#gunsound');
        this.gun = document.querySelector('#gun');
    
        // player status
        this.status = {
            rotating:false,
            shooting:false,
            running:false
        }

        // public methods
        this.startShooting = AFRAME.utils.bind(this.startShooting, this);
        this.stopShooting = AFRAME.utils.bind(this.stopShooting, this);

        this.startRunning = AFRAME.utils.bind(this.startRunning, this);
        this.stopRunning = AFRAME.utils.bind(this.stopRunning, this);

        this.shooting = AFRAME.utils.bind(this.shooting, this);
        this.running = AFRAME.utils.bind(this.running, this);
        this.rotate = AFRAME.utils.bind(this.rotate, this);
        this.onRenderStart = AFRAME.utils.bind(this.onRenderStart, this);

        this.FLY_MODE = false;

        this.el.sceneEl.addEventListener('renderstart', this.onRenderStart);

    },

    onRenderStart: function() {

        this.speedWalk = this.player.components['movement-controls'].data.speed || 0.15;
        this.speedRun = this.speedWalk*2.5;

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
        //this.gunsound.components.sound.playSound();
        //this.gun.setAttribute('animation',"property: rotation; to: 0 0 1; loop: false; dur: 100");

    },

    startRunning: function() {

        if (this.status.running) return;

        AFRAME.log(`player: start running @${Date.now()}: speedRun = ${this.speedRun}, current = ${this.player.components['movement-controls'].data.speed}`);
        
        this.status.running = true;
        this.running();
        this.runningInterval = setInterval(this.running, 90);
        this.player.components['movement-controls'].data.speed = this.speedRun;

    },

    stopRunning: function() {

        if (!this.status.running) return;

        AFRAME.log(`player: stop running @${Date.now()}: speedWalk = ${this.speedWalk}, current = ${this.player.components['movement-controls'].data.speed}`);        

        this.status.running = false;
        clearInterval(this.runningInterval);
        this.player.components['movement-controls'].data.speed = this.speedWalk;

    },

    running: function() {



    },

    moveUpOrDown: function(thumbstickDistanceY) {

        AFRAME.log(`player: moveUpOrDown: thumbstickDistanceY=${thumbstickDistanceY} `);

        if ( thumbstickDistanceY > 0 ) {
            // move up
            this.player.object3D.position.y +=-this.data.player_translate_vertical;
        } else {
            // move down
            this.player.object3D.position.y += this.data.player_translate_vertical;
        }

    },

    rotate: function (thumbstickDistanceX) {

        if (this.status.rotating)  {
            return;
        }

        AFRAME.log(`player: rotate: thumbstickDistanceX=${thumbstickDistanceX} `);

        this.rotateStart(thumbstickDistanceX);

    },

    rotateStart: function (thumbstickDistanceX) {

        AFRAME.log(`player: rotateStart: thumbstickDistanceX=${thumbstickDistanceX} `);

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

    getRandomInt: function (min, max) {

        min = Math.ceil( min );
        max = Math.floor( max );
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;

    }
});

