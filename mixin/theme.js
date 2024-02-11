
/**
 * Theme Mixin
 * 
 * INSTRUCTIONS:
 * include in the root component
 * 
 * USAGE:
 * <button @click="fn()" :class="$root.buttonClass('primary')">Execute</button>
 * 
 */

const THEME_KEY = 'theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

export default {

    beforeMount() {
        this.iniTheme();
    },

    mounted() {
        //this.iniTheme();
    },

    data() {
        return {
            theme: null,
        };
    },

    watch: {
        theme: {
            handler(newValue, oldValue) {
                this.syncTheme();
            }
        }
    },

    methods: {

        iniTheme() {
            this.theme = localStorage.getItem(THEME_KEY) ?? THEME_LIGHT;
        },

        buttonClass(color, moreClasses = null) { // in future dev add ability to add more classes to the below string
            return `btn ${this.isTheme(THEME_DARK) ? 'btn-outline' : 'btn'}-${color}`;
        },

        isTheme(value) {
            return this.theme === value;
        },

        toggleTheme() {
            this.theme = this.isTheme(THEME_DARK) ? THEME_LIGHT : THEME_DARK;
        },

        syncTheme() {
            document.body.className = this.theme;
            localStorage.setItem(THEME_KEY, this.theme);
        }

    },

    //computed: {},

};

/**
 * USAGE:
 * 
 * <button @click="fn()" :class="$root.buttonClass('primary')">Execute</button>
 */
