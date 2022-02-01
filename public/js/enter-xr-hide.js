AFRAME.registerComponent('enter-xr-hide', {
    // Set this object invisible while in VR mode.
    init: function () {

        this.el.sceneEl.addEventListener('enter-vr', (ev) => {
            this.el.setAttribute('visible', false);
        });

        this.el.sceneEl.addEventListener('exit-vr', (ev) => {
            this.el.setAttribute('visible', true);
        });
        
    }
});