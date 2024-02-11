export default {

    props: ['flag'], // add in more props to alter the icons and classNames in beforeMount()

    data: function () {
        return {
            pass: {
                icon: 'check',
                className: 'text-success'
            },
            fail: {
                icon: 'close',
                className: 'text-danger'
            },
        };
    },

    template: `<div style="display: inline;" class="non-clickable">
        <i v-if="flag" class="material-icons" :class=pass.className>{{ pass.icon }}</i>
        <i v-else class="material-icons" :class="fail.className">{{ fail.icon }}</i>
    </div>`
};
