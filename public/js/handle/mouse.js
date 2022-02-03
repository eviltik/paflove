AFRAME.registerComponent('handle-mouse', {

    multiple:false,
    
    init: function () {

        this.playerEl = document.querySelector('#player');

        this.onMouseDown = AFRAME.utils.bind(this.onMouseDown, this);
        this.onMouseUp = AFRAME.utils.bind(this.onMouseUp, this);
        this.onRenderStart = AFRAME.utils.bind(this.onRenderStart, this);
        this.installHandlers = AFRAME.utils.bind(this.installHandlers, this);
        this.removeHandlers = AFRAME.utils.bind(this.removeHandlers, this);

        this.el.sceneEl.addEventListener('renderstart', this.onRenderStart);
        
        //document.body.addEventListener('mousepress', this.onMousePress);

        this.el.sceneEl.addEventListener('enter-vr', this.removeHandlers);
        this.el.sceneEl.addEventListener('exit-vr', this.installHandlers);

        this.installHandlers();

    },

    installHandlers: function () {

        document.body.addEventListener('mousedown', this.onMouseDown, false);
        document.body.addEventListener('mouseup', this.onMouseUp, false);

    },

    removeHandlers: function () {
        
        document.body.removeEventListener('mousedown', this.onMouseDown, false);
        document.body.removeEventListener('mouseup', this.onMouseUp, false);

    },

    onRenderStart: function () {

        //console.log('mouse-handler:onRenderStart');
        this.player = this.playerEl.components.player;

    },

    onMouseDown: function() {

        //console.log('mouse-handler:onMouseDown');
        this.player.startShooting();

    },

    onMouseUp: function() {

        //console.log('mouse-handler:onMouseUp');
        this.player.stopShooting();
        
    }
});
        
