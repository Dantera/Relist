
export default {

    data: function () {
        return {
            record: null,
            records: null,
        };
    },

    methods: {

        filterRecords(key=null) {
            if (key != null) {
                this.records.toggleFilter(key);
            }
            this.sortRecords();
            //if (this.records.getF)
            this.records.Filter.filter.master = this.filter; // use only if filter is type master
            this.records.Filter.filterRecords();
        },

        sortRecords() {
            this.records.sortRecords(this._sortRecords);
        },

        _sortRecords(a, b) {
            /*
            if (a.strCustomerName == b.strCustomerName) {
                if (a.strJobNumber > b.strJobNumber) return 1;
                if (a.strJobNumber < b.strJobNumber) return -1;
            }
            if (a.strCustomerName > b.strCustomerName) return 1;
            if (a.strCustomerName < b.strCustomerName) return -1;
            */
            return 0;
        },

        isKey(column) {
            return this.isPrimaryKey(column) || this.isForeignKey(column);
        },

        isPrimaryKey(column) {
            return column.hasOwnProperty('isPK') && column.isPK;
        },

        isForeignKey(column) {
            return column.hasOwnProperty('fk'); // && !this.isEmpty(column.fk);
        },

        isSort(column) {
            return column.hasOwnProperty('sort'); //column.sort && this.records.Sort.isSortBy(column.key);
        },

        isFilter(column) {
            return column.hasOwnProperty('filter');// && column.filter === true;
        },

        useFilter(column) {
            return column.filter === true;
        },

        isBoolean(column) {
            return column.type == 'bool' || column.type == 'boolean';
        },

        getName(column, record) {
            /*
            let fn = `${column.fk}ById`;
            let _record = this.$store.getters[fn](record[column.code]);
            return _record.strName;
            */
            let temp = this.fkrecords.find(_record => _record[column.key] == record[column.key]);
            return temp['value'];
        },

    },

    computed: {

        columns() {
            return this.records.columns;
        },
        
        rows() {
            return this.records.records;
        },

        highlight() {
            return this.records.Filter.highlight.engaged;
        },

    },
};
