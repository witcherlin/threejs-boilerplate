import './styles/index.scss';

import Viewer from './../modules/viewer';

export default class App {
    constructor() {
        this.viewer = new Viewer({
            element: '#viewer'
        });
    }
}
