AFRAME.registerComponent('boot', {
    init: function () {

        this.el.sceneEl.addEventListener('renderstart', this.onRenderStart);
        
    },

    onRenderStart: function () {
        console.log('boot:onRenderStart');
        AFRAME.log('boot:onRenderStart');
    }
});