
export default class Debounce {

    // Attributes

    _state = false;
    _delay = 225;
    _timer = null;


    // Methods

    debouncify(callback) {

        if (this.state) {
            this.haltTimer();
        }

        this.debounce(callback);

    }

    debounce(callback) {
        let _this = this; // scoped reference for inside below function
        this.debounce.timer = this.makeTimer(() => {
            callback();
            _this.killTimer();
        });
    }

    makeTimer(fn) {
        this.timer = setTimeout(fn, this.delay);
    }

    haltDebounce() {
        clearTimeout(this.timer);
    }

    killDebounce() {
        this.timer = null;
    }


    // Accessors


    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }


    get delay() {
        return this._delay;
    }

    set delay(value) {
        this._delay = value;
    }


    get timer() {
        return this._timer;
    }

    set timer(ref) {
        this._timer = ref;
    }

};
