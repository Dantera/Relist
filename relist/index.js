
import Filter from './_filter.js';
import Sort from './_sort.js';
import Paginate from './_pagination.js';
//import Debounce from './_debounce';


export default class Relist {

    // Attributes

    _filter;
    _sort;
    _paginate;
    //_debounce = new Debounce();;

    _records = {
        original: [],
        modified: [],
        subset: [],
        selected: [],
    };

    _icons = {
        asc: 'expand_less',
        desc: 'expand_more',
        default: 'unfold_more',
        filter: 'search',
        viewing: 'manage_search',
        source: 'storage'
    };

    _columns = [];


    // Constructor

    constructor() {
        this._filter = new Filter(this);
        this._sort = new Sort(this);
        this._paginate = new Paginate(this);
        //this._debounce = new Debounce();
    }



    // Accessors

    get records() {
        return this._records.subset;
    }

    set records(value) {
        this._records.original = value;
    }

    get icons() {
        return this._icons;
    }

    set icons(value) {
        this._icons = value;
    }

    get columns() {
        return this._columns;
    }

    set columns(value) {
        this._columns = value;
    }

    get recordsAvailable() {
        return this._records.original.length > 0;
    }

    get Filter() {
        return this._filter;
    }

    get Sort() {
        return this._sort;
    }

    get Paginate() {
        return this._paginate;
    }

    /*
    get Debounce() {
        return this._debounce;
    }
    */

    // Methods

    copy(value) {
        return JSON.parse(JSON.stringify(value));
    }

    isString(value) {
        return value instanceof String;
    }

    output(value) {
        //console.log(value);
    }

    initialize(columnMap, records, record = null) {
        this.iniColumns(columnMap);
        this.iniFilters(columnMap, record);
        this.iniRecords(records);
    }

    initialize2(columnMap, data, record = null) {
        // prep data for v-html
        this.iniData(data);
        // prep map for v-html
        this.iniMap(columnMap);
        this.iniColumns(columnMap);
        this.iniFilters(columnMap, record);
        this.iniRecords(data);
        //this.iniHeaders(columnMap);
    }

    // data fields for sort or filter
    // ReList fields
    iniData(data, keys=null) {
        if (!keys) keys = Object.keys(data[0]);
        data.forEach(datum => {
            keys.forEach(key => {
                datum[`_${key}`] = datum[key]; //`${datum[key]}`; // add mutable field with same data
            }, this);
        });
    }

    iniMap(dataMap) {
        dataMap.forEach(datumMap => {
            
            if (this.isPrimaryKey(datumMap)) { // Primary Key
                //delete datumMap.sort;
                //delete datumMap.filter;
            } else if (this.isForeignKey(datumMap)) { // Foreign Key
                //
            }
            
            if (this.isSort(datumMap)) { //this.isSort(datumMap)) { // Sort
                datumMap.sort = false;
            }
            
            if (this.isFilter(datumMap)) { // Filter
                datumMap.filter = true;
                datumMap.key = `_${datumMap.key}`;
            }

        }, this);
    }

    isSort(column) {
        return column.hasOwnProperty('sort') && column.sort;
    }

    isFilter(column) {
        return column.hasOwnProperty('filter') && column.filter;
    }

    useFilter(column) {
        return column.filter === true;
    }

    isKey(column) {
        return this.isPrimaryKey(column) || this.isForeignKey(column);
    }

    isPrimaryKey(column) {
        return column.hasOwnProperty('isPK') && column.isPK;
    }

    isEmpty(value) {
        return value === null || value != '';
    }
    
    isForeignKey(column) {
        return column.hasOwnProperty('fk') && !this.isEmpty(column.fk);
    }

    isFilterable(column) {
        return column.hasOwnProperty('filter') && column.isFilter;
    }

    iniColumns(columnMap) {
        columnMap.forEach((column) => {
            this.columns.push(this.copy(column));
        }, this);
    }

    iniFilters(columnMap, record = null) {
        this.output(`Filter Type: ${this.Filter.filterType ? 'MASTER' : 'COLUMN'}`);
        if (this.Filter.filterType) return; // if filter type is MASTER, then do not ini filters
        let key, value;
        columnMap.forEach((column) => {
            if (column.filter) {
                key = column.key;
                value = (record !== null) ? record[column.key] : '';
                if (this.isString(value)) {
                    value.trim();
                }
                this.Filter.addFilter(key, value);
            }
        }, this);
    }

    iniRecords(records) {
        this._records.original = this.copy(records);
        this._records.modified = this.copy(this._records.original);
        this._records.subset = (this._records.length > 0) ? this.Paginate.limit(this._records.modified) : this.copy(this._records.original); // TODO: fix this
    }

    getData() {
        return this.records.subset;
    }

    loadFrom(records) {
        return this.copy(records).sort(this._byValue(this.sort.by));
    }

    getRequestClass(record) {
        // return a class name by some sort of condition(s)
    }

    getRequestStyle(record) {
        // return a style value by some sort of condition(s)
    }

    isChecked(key) {
        return this.Filter.columns[key].active ? 'checked' : '';
    }

    toggleFilter(key) {
        this.Filter.filter.columns[key].active = !this.Filter.filter.columns[key].active;
        this.Filter.filterRecords();
    }

    view(record) {
        // TODO: use record.id and "navigate" to record view
        this.output(`View record.id: ${record.id}`);
    }

    enableAllMatches() {
        Object.keys(this.filters).forEach(key => {
            this.output(`filter[${key}].active: ${this.Filter.columns[key].active ? 'ON' : 'OFF'}`);
            this.Filter.columns[key].active = true;
        });
        this.filterRecords();
    }

    addRecord(record) {
        this._records.original.push(this.copy(record));
    }

    removeRecord(index) {
        this._records.original.splice(index, 1);
    }

    sortRecords(callback=null) {
        this._records.original.sort((a, b) => callback(a, b));
    }

    defaultSort(records) {
        // https://stackoverflow.com/questions/68587543/sort-array-of-objects-by-value-of-unknown-keys
        let result = records.map(object => {
            for (key in object) {
                return [key, object[key]]
            }
        })
            .sort((a, b) => b[1] - a[1])
            .map(object => object[0])
    }

    defaultSort2(obj) {

        let sortedObj = obj.reduce(function (result, item) {

            let key = Object.keys(item)[0], value = item[key]; // get the name and value of the current object
            let list = result[value]; // get the list of names for that value
            if (!list) result[value] = list = []; // if this is the first occurence of the value, create the array
            list.push(key); // add the name to the array
            return result;

        }, {});

        let sortedList = Object.values(sortedObj);

        let result = sortedList.flat(); // convert from Array<Array<string>> to Array<string>

        return result;
    }

    defaultSort4(input) {
        let output = input
            .map(Object.entries)
            .sort(([a], [b]) => b[1] - a[1])
            .map(([[name]]) => name);
        return output;
    }

    /*
     * add fields to the records that are for the app to use
     * but arent part of the records
     * i.e. functional value but not retained business value
    */
    addAuxillaryFields(records, fields) {
        records.forEach(record => {      
            fields.forEach(field => {
                record[field.name] = field.value;
            }, this);
        });
    }

    // TEMP //////////

    iniHeaders(map) {
        let headers = []
        map.forEach((datum, index) => {
            //
            headers.push({ key: datum.key, display: datum.display });
        }, this);
        this._headers = headers;
    }

}
