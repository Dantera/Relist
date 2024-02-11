
/**
 * GES Job Takedown Project
 */

// import RelistMixin from '../core/relist/index.js';
// import RelistTemplate from '../core/relist/template.js';
// import Map from '.js';

import Relist from '../relist/index.js';

const app = Vue.createApp({

    beforeMount() {
        
        this.open = new Relist();
        this.locked = new Relist();

        let record;
        let records = [];

        DATASET.OpenJobs.forEach(item => {
            record = {
                // mutable values for markup injection
                _strJobNumber: item.strJobNumber,
                _strJobName: item.strJobName,
                _strCustomerName: item.strCustomerName,
                // non-mutable values
                strJobNumber: item.strJobNumber,
                strJobName: item.strJobName,
                strCustomerName: item.strCustomerName,
            };
            records.push(record);
        }, this);

        this.open.Filter.setFilterType = 'MASTER';
        this.open.initialize(DATA_MAP, this.copy(records));

        records = [];

        DATASET.LockedJobs.forEach(item => {
            record = {
                // mutable values for markup injection
                _strJobNumber: item.strJobNumber,
                _strJobName: item.strJobName,
                _strCustomerName: item.strCustomerName,
                // non-mutable values
                strJobNumber: item.strJobNumber,
                strJobName: item.strJobName,
                strCustomerName: item.strCustomerName,
            };
            records.push(record);
        }, this);

        this.locked.Filter.setFilterType = 'MASTER';
        this.locked.initialize(DATA_MAP, this.copy(records));
        this.filterRecords();

    },

    data: function () {
        return {
            open: null,
            locked: null,
            filter: '',
        };
    },

    methods: {

        copy(value) {
            return JSON.parse(JSON.stringify(value));
        },

        filterRecords() {
            this.sortRecords();
            this.open.Filter.filter.master = this.filter;
            this.locked.Filter.filter.master = this.filter;
            this.open.Filter.filterRecords();
            this.locked.Filter.filterRecords();
        },

        sortRecords() {
            this.open.sortRecords(this._sortRecords);
            this.locked.sortRecords(this._sortRecords);
        },

        clearSearch() {
            this.filter = '';
            this.filterRecords();
        },

        lockRecord(strJobNumber) {

            // show modal

            let url = '/GesJob/LockJob';

            let params = {
                strJobNumber: strJobNumber
            };

            let success = (response) => {
                //console.log(response.data);
                if (response.data) {
                    let index;
                    index = this.open._records.original.findIndex(e => e.strJobNumber == strJobNumber);
                    let record = this.copy(this.open._records.original[index]);
                    this.locked.addRecord(record);
                    this.open.removeRecord(index);
                    this.filterRecords()
                    // hide modal
                    //this.$toast.success('Job Locked');
                } else {
                    // hide modal
                    //this.$toast.danger('Job Not Locked');
                }
            };

            let failure = (response) => {
                console.log('COMMS FAILURE');
                console.log(response);
            }

            //this.$ajax._fetchData(url, success, params);
            return axios.post(url, params)
                .then(success.bind(this), failure.bind(this))
                //.catch(errorHandler.bind(this))
                /*
                .finally(() => {
                    console.debug('REQUEST COMPLETE');
                    this.hideModal();
                })
                */;
        },

        unlockRecord(strJobNumber) {

            // show modal

            let url = '/GesJob/UnlockJob';

            let params = {
                strJobNumber: strJobNumber
            };

            let success = (response) => {
                //console.log(response.data);
                if (response.data) {
                    let index;
                    index = this.locked._records.original.findIndex(e => e.strJobNumber == strJobNumber);
                    let record = this.copy(this.locked._records.original[index]);
                    this.open.addRecord(record);
                    this.locked.removeRecord(index);
                    this.filterRecords()
                    // hide modal
                    //this.$toast.success('Job Unlocked');
                } else {
                    // hide modal
                    //this.$toast.danger('Job Not Unlocked');
                }
            };

            let failure = (response) => {
                console.log('COMMS FAILURE');
                console.log(response);
            }

            //this.$ajax._fetchData(url, success, params);
            return axios.post(url, params)
                .then(success.bind(this), failure.bind(this))
                //.catch(errorHandler.bind(this))
                /*
                .finally(() => {
                    console.debug('REQUEST COMPLETE');
                    this.hideModal();
                })
                */;
        },

        _sortRecords(a, b) {
            if (a.strCustomerName == b.strCustomerName) {
                if (a.strJobNumber > b.strJobNumber) return 1;
                if (a.strJobNumber < b.strJobNumber) return -1;
            }
            if (a.strCustomerName > b.strCustomerName) return 1;
            if (a.strCustomerName < b.strCustomerName) return -1;
            return 0;
        },

        /*
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

        */

    },
});

app.use(VueAxios, axios);

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
