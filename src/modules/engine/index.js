// import Tween from './tween.js';
import Events from './events.js';
import Raycaster from './raycaster.js';

THREE.Cache.enabled = true;

export const MODE = {
    NONE: 0,
    VR: 1
};

export default class Engine extends Events {
    constructor(props) {
        super();

        this.props = props;

        // Init
        this.mode = this.props.mode === undefined ? MODE.NONE : this.props.mode;
        this.selector = this.props.selector === undefined ? document.body : this.props.selector;

        this.container = typeof this.selector === 'string' ? document.querySelector(this.selector) : this.selector;

        this.width = this.props.width || window.innerWidth;
        this.height = this.props.height || window.innerHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.name = 'Scene';

        // Clock
        this.clock = new THREE.Clock();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);

        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.renderSingleSided = false;
        this.renderer.shadowMap.renderReverseSided = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.autoClear = false;
        this.renderer.sortObjects = false;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.container.appendChild(this.renderer.domElement);

        // Stereo
        if (this.mode === MODE.VR) {
            this.stereo = new THREE.OculusRiftEffect(this.renderer);

            const hmd = this.stereo.getHMD();

            hmd.hResolution = this.width;
            hmd.vResolution = this.height;

            this.stereo.setHMD(hmd);

            this.stereo.setSize(this.width, this.height);
        }

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 5000);
        this.camera.name = 'Camera';
        this.camera.position.set(0, 0, -10);
        this.scene.add(this.camera);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.device = false;
        this.controls.inverse = false;
        this.controls.enableDamping = false;
        this.controls.dampingFactor = 0.25;
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        // Raycaster
        this.raycaster = new Raycaster(this.camera, this.renderer);

        // Function
        this.listen();
        this.render();
        this.debug();
    }

    listen() {
        THREE.DefaultLoadingManager.onStart = () => this.emit('start');
        THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => this.emit('progress', (loaded / total * 100), item, loaded, total);
        THREE.DefaultLoadingManager.onLoad = () => this.emit('load');
        THREE.DefaultLoadingManager.onError = () => this.emit('error');

        //

        this.renderer.domElement.addEventListener('click', (event) => this.emit('click', event), false);
        this.renderer.domElement.addEventListener('dblclick', (event) => this.emit('dblclick', event), false);
        this.renderer.domElement.addEventListener('contextmenu', (event) => { event.preventDefault(); return this.emit('contextmenu', event); }, false);

        // this.renderer.domElement.addEventListener('mouseout', (event) => this.emit('mouseout', event), false);
        this.renderer.domElement.addEventListener('mouseup', (event) => this.emit('mouseup, pointerup', event), false);
        // this.renderer.domElement.addEventListener('touchend', (event) => this.emit('touchend, pointerup', event), false);
        // this.renderer.domElement.addEventListener('touchcancel', (event) => this.emit('touchcancel', event), false);
        // this.renderer.domElement.addEventListener('touchleave', (event) => this.emit('touchleave', event), false);

        this.renderer.domElement.addEventListener('mousedown', (event) => this.emit('mousedown, pointerdown', event), false);
        // this.renderer.domElement.addEventListener('touchstart', (event) => this.emit('touchstart, pointerdown', event), false);

        this.renderer.domElement.addEventListener('mousemove', (event) => this.emit('mousemove, pointermove', event), false);
        // this.renderer.domElement.addEventListener('touchmove', (event) => this.emit('touchmove, pointermove', event), false);

        //

        window.addEventListener('keydown', (event) => this.emit('keydown', event), false);
        window.addEventListener('keyup', (event) => this.emit('keyup', event), false);

        window.addEventListener('orientationchange', () => {
            this.resize(this.props.width, this.props.height);
            this.emit('orientationchange');
        }, false);

        window.addEventListener('resize', () => {
            this.resize(this.props.width, this.props.height);
            this.emit('resize');
        }, false);
    }

    resize(width, height) {
        this.width = width || window.innerWidth;
        this.height = height || window.innerHeight;

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        if (this.mode === MODE.VR) {
            const hmd = this.stereo.getHMD();

            hmd.hResolution = this.width;
            hmd.vResolution = this.height;

            this.stereo.setHMD(hmd);

            this.stereo.setSize(this.width, this.height);
        } else {
            this.renderer.setSize(this.width, this.height);
        }
    }

    render() {
        if (this.mode === MODE.VR) {
            this.stereo.render(this.scene, this.camera);
        } else {
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }

        window.requestAnimationFrame(() => {
            TWEEN.update();

            this.controls.update();

            this.emit('update', this.clock.getDelta());

            this.render();
        });
    }

    debug() {
        window.scene = this.scene;
        window.camera = this.camera;
        window.controls = this.controls;
        window.renderer = this.renderer;
    }
}
