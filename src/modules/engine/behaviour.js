import async from 'async';

import Events from './events';
import Engine from './index';

let events = null;
let engine = null;
let scene = null;

export default class Behaviour extends Events {
    static props = {
        selector: 'body'
    };

    constructor(...args) {
        super();

        if (engine === null) {
            const props = Object.assign({}, Behaviour.props, args[0]);

            engine = new Engine(props);

            scene = new THREE.Group();
            scene.name = 'Hierarchy';

            engine.scene.add(scene);

            events = new Events();
        }

        this.events = events;
        this.engine = engine;
        this.scene = scene;

        this.camera = engine.camera;
        this.controls = engine.controls;
        this.renderer = engine.renderer;
        this.raycaster = engine.raycaster;

        this.init(...args);

        let funcs = this.before();
        let done = funcs.pop();

        async.eachSeries(funcs, (func, next) => {
            func.call(this, next);
        }, (err) => {
            if (done) {
                done.call(this, err);
            }

            this.start();
            this.ui();
            this.listen();
        });
    }

    init() {

    }

    before() {
        return [];
    }

    start() {

    }

    ui() {

    }

    listen() {

    }
}
