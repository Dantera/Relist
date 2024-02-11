
/**
 * ReList Demo
 * Single Dataset
 */

// import RelistMixin from '../core/relist/index.js';
// import RelistTemplate from '../core/relist/template.js';
import DataSet from './support/data.js';
import DataMap from './support/map.js';

import Relist from './relist/index.js';

import ThemeMixin from './mixin/theme.js';

import RelistHeader from './relist/component/header.js';

import BoolIcon from './component/boolIcon.js';

import ReListMixin from './relist/mixin.js';

const app = Vue.createApp({

    beforeMount() {
        
        this.record = {
            field1: 1,
            field2: 2,
            field3: 3,
            _field1: 1,
            _field2: 2,
            _field3: 3
        }

        this.records = new Relist();
        
        this.records.Filter.setFilterTypeToMaster(); // = 'COLUMN';
        this.records.initialize2(DataMap, DataSet, this.record);
        
        this.filterRecords();

    },

    mixins: [ThemeMixin, ReListMixin],

    components: {RelistHeader, BoolIcon},

    data: function () {
        return {
            fkrecords: [
                { fkid: 1, value: 'ALPHA' },
                { fkid: 2, value: 'OMEGA' },
            ],
        };
    },

    methods: {

        copy(value) {
            return JSON.parse(JSON.stringify(value));
        },

        isEmpty(value) {
            return value === null || value != '';
        },
    },

    computed: {

    },

    template: `
    <div id="relist">
        <RelistHeader></RelistHeader>
        <table class="table table-condensed table-striped relist">
            <thead>
                <tr>
                    <th>#</th>
                    <template v-for="column in columns">
                        <th v-if="column.visible">
                            <label class="form-input-label">{{ column.display }}</label><br>
                            <div class="form-check" v-if="records.Filter.getFilterType == 'COLUMN' && !isKey(column) && isFilter(column)">
                                <input type="checkbox" class="form-check-input" v-model="column.filter" @change="filterRecords(column.key)" />
                                <input class="form-control" disabled :value="record[column.key]" />
                            </div>
                        </th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in rows">
                    <td>{{ index }}</td>
                    <template v-for="column in columns">
                        <!--<td v-html="record[column.key]"></td>-->
                        <td v-if="isForeignKey(column)">
                            {{ getName(column, record) }}
                        </td>
                        <td v-else-if="isBoolean(column)">
                            <bool-icon :flag="record[column.key]" />
                        </td>
                        <td v-else-if="highlight" v-html="record[column.key]"></td>
                        <td v-else>{{ record[column._key] }}</td>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
    `

});

app.mount('#app')

/*
// Directory App

import BackArrow from '../lib/common/backarrow.js';

import store from './store.js';

Vue.use(VueRouter);
import router from './router.js';

import Fetcher from '../lib/fetcher.js';
import COMPANY_MAP from './company/map.js';
import PERSON_MAP from './person/map.js';

const dataRequestUrls = [`/GesDirectory/ListCompany/`, '/GesDirectory/ListPerson'];

Vue.component('BackArrow', BackArrow);

new Vue({

    store,
    router,

    beforeMount: function () {
        Fetcher.beforeMount(dataRequestUrls, (result) => {
            this.$store.dispatch('setCompanyRecords', JSON.parse(result[0].data));
            this.$store.dispatch('setPersonRecords', JSON.parse(result[1].data));
            this.$store.dispatch('setCompanyMap', COMPANY_MAP);
            this.$store.dispatch('setPersonMap', PERSON_MAP);
        });
    },

    template: `<router-view></router-view>`

}).$mount('#app');
*/
