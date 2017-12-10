import Behaviour from './../engine/behaviour';

export default class Viewer extends Behaviour {
    init() {
        this.camera.position.set(5, 5, 5);

        //

        this.axis = new THREE.AxisHelper(4);
        this.axis.name = 'Axis';
        this.scene.add(this.axis);

        //

        this.light = {};

        this.light.ambient = new THREE.AmbientLight(0x555555);
        this.light.ambient.name = 'Ambient Light';
        this.scene.add(this.light.ambient);

        this.light.directional = new THREE.DirectionalLight(0xaaaaaa, 1);
        this.light.directional.name = 'Directional Light';
        this.light.directional.position.set(1, 1, -1).normalize();
        this.camera.add(this.light.directional);
    }

    start() {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshNormalMaterial()
        );
        this.mesh.name = 'Box';
        this.scene.add(this.mesh);

    }

    listen() {
        this.engine.on('mousedown', (event) => {
            console.log('on:mousedown', event);
        });

        this.engine.on('contextmenu', (event) => {
            console.log('on:contextmenu', event);
        });
    }
}
