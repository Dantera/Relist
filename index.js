
import UtilMixin from '../mixin/utils.js';
import SortMixin from './_sort.js';
import FilterMixin from './_filter.js';
import PaginationMixin from './_pagination.js';

export default {

    mixins: [ UtilMixin, SortMixin, FilterMixin, PaginationMixin ],

    data: function () {
        return {
    
            // Google Material Icons
            icons: {
                asc: 'expand_less',
                desc: 'expand_more',
                default: 'unfold_more',
                filter: 'search',
                viewing: 'manage_search',
                source: 'storage'
            },

            columns: [],

            records: {
        	    original: [],
			    modified: [],
                subset: []
            },
        
        };
    },
    
    methods: {

        initialize: function (columnMap, records, record = null) {
            this.iniColumns(columnMap);
            this.iniFilters(columnMap, record);
            this.iniRecords(records);
        },

        iniColumns: function (columnMap) {
            columnMap.forEach((column) => {
                this.columns.push(this.copy(column));
            }, this);
        },

        iniFilters: function (columnMap, record = null) {
            console.log(`Filter Type: ${this.filterType ? 'MASTER' : 'COLUMN'}`);
            if (this.filterType) return; // if filter type is MASTER, then do not ini filters
            let key, value;
            columnMap.forEach((column) => {
                if (column.filter) {
                    key = column.code;
                    value = (record !== null) ? record[column.code] : '';
                    if (this.isString(value)) {
                        value.trim();
                    }
                    this.addFilter(key, value);
                }
            }, this);
        },

        iniRecords: function (records) {
            this.records.original = this.copy(records);
            this.records.modified = this.copy(this.records.original);
            this.records.subset = this.limit(this.records.modified);
        },

        getData: function() { return this.records.subset; },

        loadFrom: function(records) {
            return this.copy(records).sort(this._byValue(this.sort.by));
        },
    
        getRequestClass: function(record) {
        	// return a class name by some sort of condition(s)
        },

        getRequestStyle: function(record) {
        	// return a style value by some sort of condition(s)
        },

        isChecked: function (code) {
            return this.filter.columns[code].active ? 'checked' : '';
        },

        toggleFilter: function (code) {
            this.filter.columns[code].active = !this.filter.columns[code].active;
            this.filterRecords();
        },

        view: function (record) {
            // TODO: use record.id and "navigate" to record view
            this.output(`View record.id: ${record.id}`);
        },

        enableAllMatches: function () {
            Object.keys(this.filters).forEach(key => {
                console.log(`filter[${key}].active: ${this.filter.columns[key].active ? 'ON' : 'OFF'}`);
                this.filter.columns[key].active = true;
            });
            this.filterRecords();
        },

    },

    computed: {

        recordsAvailable: function () {
            return this.records.original.length > 0;
        }

    },
     
};
