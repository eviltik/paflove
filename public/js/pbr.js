//view-source:https://aframepbr.glitch.me/

AFRAME.registerComponent("pbr", {
    init: function() {
      var renderer = this.el.sceneEl.renderer;

      this.el.addEventListener("loaded", e => {
        let mesh = this.el.getObject3D("mesh");
        var loader = new THREE.TextureLoader();
        var textureCombined = loader.load('https://cdn.glitch.com/7cb3ddec-f241-48b7-919e-5c84f895819f%2Ftexture_combined.jpg?v=1593550709807');
        var textureDiffuse = loader.load('https://cdn.glitch.com/7cb3ddec-f241-48b7-919e-5c84f895819f%2Froad_with_tram_rails_24_67_diffuse.jpg?v=1593552782444');
        var textureNormal = loader.load('https://cdn.glitch.com/4ae0ea55-4cbb-478f-8b93-729af08ccb20%2Froad_with_tram_rails_24_67_normal.jpg?v=1589419143929');

        // this is required in order to display ambient occlusion PBR texture correctly
        mesh.geometry.addAttribute( 'uv2', new THREE.BufferAttribute( mesh.geometry.attributes.uv.array, 2 ) );
        
        mesh.traverse(function(el) {
          if (el.material) {
            el.material.map = textureDiffuse;
            el.material.map.anisotropy = 16;
            el.material.metalnessMap = textureCombined;
            el.material.aoMap = textureCombined;
            el.material.roughnessMap = textureCombined;
            el.material.roughness = 1;
            el.material.normalMap = textureNormal;
            el.material.metalness = 1;
            el.material.needsUpdate = true;
          }
        });
      });
    }
  });
  