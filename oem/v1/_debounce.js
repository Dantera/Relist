
// https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44

export default {

    onDestroy: function() {
        this.haltTimer = null;
    },

    data: function() { return {

        debounce: {

        	state: false,
        	delay: 225,
    	   	timer: null

        },

    }; },

    methods: {

        debouncify: function(callback) {
            
            if (this.debounce.state) {
                this.haltTimer();
            }
            
            this._debounce(callback);
            
        },

        _debounce: function(callback) {
            let _this = this; // scoped reference for inside below function
            this.debounce.timer = this.makeTimer(() => {
                callback();
                _this.killTimer();
            });
        },

        makeTimer: function(fn) {
            this.debounce.timer = setTimeout(fn, this.debounce.delay);
        },

        haltDebounce: function() {
            clearTimeout(this.debounce.timer);
        },

        killDebounce: function() {
            this.debounce.timer = null;
        }

    },
};
