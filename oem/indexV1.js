
/**
 * GES Job Takedown Project
 */

// import RelistMixin from '../core/relist/index.js';
// import RelistTemplate from '../core/relist/template.js';
// import Map from '.js';

import RelistMixin from '../relist/index.js';

Vue.createApp({

    // components: {},

    mixins: [RelistMixin],

    beforeMount() {
        let record;
        let records = [];
        DATASET.forEach(item => {
            record = {
                // mutable values for markup injection
                _strJobNumber: item.strJobNumber,
                _strJobName: item.strJobName,
                _strCustomerName: item.strCustomerName,
                // non-mutable values
                strJobNumber: item.strJobNumber,
                strJobName: item.strJobName,
                strCustomerName: item.strCustomerName,
                added: false,
            };
            records.push(record);
        }, this);
        this.setSortType = 'MASTER';
        this.initialize(DATA_MAP, records)
        
    },

    data() {
        return {
        }
    },

    methods: {

        copy(value) {
            return JSON.parse(JSON.stringify(value));
        },

        clearSearch(filter) {
            this.filter.master = '';
            this.filterRecords();
        },

        sortSelected(records) {
            return records.sort((a, b) => this._sortSelected(a, b), this);
        },

        _sortSelected(a, b) {
            if (a.strCustomerName == b.strCustomerName) {
                if (a.strJobNumber > b.strJobNumber) return 1;
                if (a.strJobNumber < b.strJobNumber) return -1;
            }
            if (a.strCustomerName > b.strCustomerName) return 1;
            if (a.strCustomerName < b.strCustomerName) return -1;
            return 0;
        },

        toggleRecord(jobNumber) {
            let index;
            index = this.records.original.findIndex(e => e.strJobNumber == jobNumber);
            if (this.records.original[index].added) {
                this.removeRecordFromList(jobNumber);
            } else {
                this.addRecordToList(jobNumber);
            }
        },

        addRecordToList(jobNumber) {
            let index;

            // modify modified records
            index = this.records.modified.findIndex(e => e.strJobNumber == jobNumber);
            this.records.modified[index].added = true;

            // copy original, otherwise markup for highlighting shows up
            index = this.records.original.findIndex(e => e.strJobNumber == jobNumber);
            this.records.original[index].added = true;
            let record = this.copy(this.records.original[index]);

            this.records.selected.push(record);
            this.records.selected = this.sortSelected(this.records.selected);
        },

        removeRecordFromList(jobNumber) {
            //console.log(`removeRecordFromList(${jobNumber})`);
            let index;

            index = this.records.modified.findIndex(e => e.strJobNumber == jobNumber);
            this.records.modified[index].added = false;

            index = this.records.original.findIndex(e => e.strJobNumber == jobNumber);
            this.records.original[index].added = false;

            index = this.records.selected.findIndex(e => e.strJobNumber == jobNumber);
            this.records.selected.splice(index, 1);
            this.records.selected = this.sortSelected(this.records.selected);
        },

        clearRecords() {
            this.records.selected = [];
            this.records.modified.forEach(item => this.removeRecordFromList(item.strJobNumber), this);
        },

        takedownRecords() {
            let takedownRecords = this.copy(this.records.selected);
            this.clearRecords();
            takedownRecords.forEach(item => {
                //this.removeRecordFromList(item.strJobNumber);
                this.takedownRecord(item.strJobNumber);
            }, this);
            this.filterRecords();
        },

        takedownRecord(jobNumber) {
            let index = this.records.original.findIndex(e => e.strJobNumber == jobNumber);
            this.records.original.splice(index, 1);
        }

    },
}).mount('#app')

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
