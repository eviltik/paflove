AFRAME.registerComponent('widget-list-menu', {

    schema:{
        contentId:{type:'string', default:'#menu-setup-environment'},
        component:{type:'string', default: '#scene'},
        attribute:{type:'string', default: 'environment'},
        property:{type:'string', default: 'preset'},
        propertyValue:{type:'string', default: 'value'},
        itemsPath:{type:'string', default:'div[value]'}
    },

    init: function () {

        this.component = document.querySelector(this.data.component);
        if (!this.component) {
            throw new Error('setup-environment: no component');
        }

        const el = document.querySelector(this.data.contentId);
        if (!el) {
            //throw new Error('setup-environment: could not find html '+this.data.contentId);
        }

        const htmlembed = document.createElement('a-entity');
        htmlembed.setAttribute('htmlembed','');
        htmlembed.setAttribute('class','clickable');
        htmlembed.setAttribute('position',this.el.getAttribute('position'));
        htmlembed.setAttribute('material', 'opacity: 0.0; transparent: true');
        htmlembed.setAttribute('transparent', 'true');
        htmlembed.setAttribute('opacity', '0.1');
        htmlembed.innerHTML = el.innerHTML;

        this.onClick = AFRAME.utils.bind(this.onClick, this);

        el.parentNode.removeChild(el);
        this.el.parentNode.removeChild(this.el);
        this.el.sceneEl.appendChild(htmlembed);

        const menuItems = document.querySelectorAll(this.data.itemsPath);
        menuItems.forEach( item => {
            item.addEventListener('click', this.onClick);
        });

    },

    onClick:function(ev) {

        if (this.selected) {
            this.selected.className = this.selected.classList.remove('selected');
        }
        ev.target.classList.add('selected');
        this.selected = ev.target;
        const value = ev.target.getAttribute(this.data.propertyValue);
        setTimeout(() => {
            AFRAME.log('change env with '+value);
            this.component.setAttribute(this.data.attribute, this.data.property+':'+value);
        }, 40);
        
    }
    
});