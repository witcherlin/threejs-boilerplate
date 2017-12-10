export default class Events {
    constructor() {
        this._events = {};
    }

    on(args, callback) {
        args.split(',').forEach((name) => {
            name = name.trim();

            if (this._events[name]) {
                this._events[name].push(callback);
            } else {
                this._events[name] = [callback];
            }
        });

        return this;
    }

    off(args) {
        args.split(',').forEach((name) => {
            name = name.trim();

            delete this._events[name];
        });

        return this;
    }

    emit(args, ...params) {
        args.split(',').forEach((name) => {
            name = name.trim();

            if (this._events[name]) {
                this._events[name].forEach((event) => {
                    event(...params);
                });
            }
        });

        return this;
    }
}
