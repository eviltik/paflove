AFRAME.registerComponent('boot', {

    multiple: false,

    init: function () {

        const IS_VR_AVAILABLE = AFRAME.utils.device.isMobile() || window.hasNonPolyfillWebVRSupport;

        this.el.sceneEl.addEventListener('renderstart', this.onRenderStart);
        this.onRenderStart = AFRAME.utils.bind(this.onRenderStart, this);  
    },

    onRenderStart: function () {
        console.log('boot:onRenderStart');
        AFRAME.log('boot:onRenderStart');
    }

});