AFRAME.registerComponent('handle-keyboard', {

    multiple:false,

    init: function () {

        this.playerEl = document.querySelector('#player');

        this.onKeyDown = AFRAME.utils.bind(this.onKeyDown, this);
        this.onKeyUp = AFRAME.utils.bind(this.onKeyUp, this);
        this.onRenderStart = AFRAME.utils.bind(this.onRenderStart, this);
        this.installHandlers = AFRAME.utils.bind(this.installHandlers, this);
        this.removeHandlers = AFRAME.utils.bind(this.removeHandlers, this);

        this.el.sceneEl.addEventListener('renderstart', this.onRenderStart);
        
        this.el.sceneEl.addEventListener('enter-vr', this.removeHandlers);
        this.el.sceneEl.addEventListener('exit-vr', this.installHandlers);

        this.installHandlers();

    },

    installHandlers: function () {

        console.log('keyboard-handler:installHandlers keyup/down');
        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);

    },

    removeHandlers: function () {
        
        console.log('keyboard-handler:removeHandlers keyup/down');
        document.body.removeEventListener('keydown', this.onKeyDown);
        document.body.removeEventListener('keyup', this.onKeyUp);

    },

    onRenderStart: function () {

        //console.log('keyboard-handler:onRenderStart');
        this.player = this.playerEl.components.player;

    },

    onKeyDown: function(ev) {

        //console.log('keyboard-handler:onKeyDown', ev);
        if (ev.shiftKey) {
            this.player.startRunning();
        }

    },

    onKeyUp: function(ev) {

        //console.log('keyboard-handler:onKeyUp', ev);
        if (!ev.shiftKey) {
            this.player.stopRunning();
        }

    }
});
        
