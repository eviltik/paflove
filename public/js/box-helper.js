AFRAME.registerComponent('box-helper', {
    init: function () {
        
        this.sphereSize = 0.2;
            
        const item = this.el.object3D.children[0];

        if (item.type === 'PointLight') {

            console.log('box-helper: adding helper', item);
            const pointLightHelper = new THREE.PointLightHelper( item, this.sphereSize );
            this.el.parentEl.object3D.add( pointLightHelper );
            return;

        } else if (item.type === 'Mesh') {

            console.log('box-helper: adding helper', item);
            //const boxHelper = new THREE.BoxHelper( item, 0xffff00 );
            //this.el.parentEl.object3D.add( boxHelper );
            return;

        }

        console.log('box-helper: unknow type ', this.el.object3D, item.type, this.el);
        
    }

});