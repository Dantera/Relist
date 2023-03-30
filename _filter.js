
const FILTER_TYPE_MASTER = true;
const FILTER_TYPE_COLUMN = false;

export default {

    data: function () {
        return {
            /*
            filter: {
                term: '',
                terms: {}
            },
            */
            allMatch: true,     // set if record must match all filters or only 1
            filters: {},
            masterFilter: '', // NEED TO ACCOUNT FOR master OR column FILTERING
            columnFilters: {},
            filter: {
                master: '',
                columns: {},
            },
            filterType: FILTER_TYPE_MASTER,   // master or columns // NEED TO DETERMINE CONDITION
            highlight: {
                engaged: true,
                class: 'highlight'
            },
            highlightEngaged: false,
            highlightClass: 'highlight',
        };
    },

    methods: {

        addFilter: function (key, value, isActive = true) {
            if (this.isNumber(value)) {
                value = value.toString();
            }
            this.filter.columns[key] = { value: value, active: isActive };
        },

        getFilterType: function () {
            return this.filterType ? 'MASTER' : 'COLUMN';
        },

        setFilterType: function (filterType) {
            this.filterType = filterType ? FILTER_TYPE_MASTER : FILTER_TYPE_COLUMN;
        },

        setFilterTypeToMaster() {
            this.setFilterType(FILTER_TYPE_MASTER);
        },

        setFilterTypeToColumn() {
            this.setFilterType(FILTER_TYPE_COLUMN);
        },

        getFilter: function () {
            //let isMasterFilter = this.masterFilter !== null && this.masterFilter !== '';
            return this.filterType ? this.filter.master : this.filter.columns;
        },

        filterOEM: function (records, types, term) {
            let results = {};
            let matched = [];
            let _this = this;
            let filter = function (type, term) {
                return function (object) {
                    if (matched.indexOf(object.id) !== -1) { // if this record is already matched
                        return null;
                    }
                    let matches = object[type].match(new RegExp(term, 'g'));
                    if (matches) { // if matched, save object id to list of mached records
                        // COULD DO THE LINE BELOW AS A FILTER INSTEAD OF DIRECTLY MANIPULATING THE DATA
                        // UPDATE: a filter did not appear to have any affect, so all sorting will draw fresh from records instead of reusing results
                        // NOTE: SHOULD NOT REFRESH RESULTS ON SORT, UNLESS THIS IS HOW THE RESULTSET DID NOT SORT PROPERLY AFTER CHANGING SORTBY
                        object[type] = _this.highlightSearchTerm(object[type], term);
                        matched.push(object.id);
                    }
                    return matches;
                };
            };

            for (let i in types) {
                results[types[i]] = records.filter(filter(types[i], term));
            }
            return results;
        },

        filterRecords: function () {
            this.records.modified = this._filter(this.records.original, this.getFilter());
            this.records.subset = this.limit(this.records.modified);
            console.log(`${this.records.modified.length} / ${this.records.original.length}`);
        },

        _filter: function (records, filterX) {
            if (Array.isArray(filterX) || typeof filterX == 'object') {
                return this._filterByColumns(records, filterX);
            } else {
                return this._filterByTerm(records, filterX)
                //return this._filterByArray(records, [filterX]);
            }
        },

        _filterByTerm: function (records, term) {

            let keys = this.getFilterableColumns(this.columns); 	// the columns that are filter enabled
            let _indices = [];						// the indices of the matching records
            let _records = [];						// the record set derived from matching
            let value;                              // temp to hold value to check typeof string || !string
            let matches;                            // used to determine if a match was made in a loop

            if (term == null || term == '') {	// if there are no term to filter for...
                return records; 		// return the records as is
            }

            // Matching
            records.forEach((record, index) => {
                keys.forEach((key) => {
                    value = `${record[key]}`; //.toString();
                    matches = this.matches(value, term) != null;
                    if (matches) {
                        _indices.push(index);
                    }
                }, this);
            }, this);

            // Unique indices
            _indices = [...new Set(_indices)];

            // Get records by indices
            _indices.forEach(_index => {
                _records.push(this.copy(records[_index]));
            }, this);

            // Highlighting
            _records.forEach(record => {
                keys.forEach((key) => {
                    value = `${record[key]}`; //.toString();
                    matches = this.matches(value, term);
                    if (matches) {
                        record[key] = this.highlight.engaged ? this.highlightTerm(value, term) : value;
                    }
                }, this);
            }, this);

            return _records;
        },

        _filterByColumns: function (records, filters) {

            let keys = this.removeVoids(filters); 	// the columns with a value present to filter
            let _indices = [];						// the indices of the matching records
            let _records = [];						// the record set derived from matching
            let value;                              // temp to hold value to check typeof string || !string
            let matches;                            // used to determine if a match was made in a loop

            if (keys.length <= 0) {	// if there are no terms to filter for...
                return records; 		// return the records as is
            }

            // Matching
            records.forEach((record, index) => {
                if (this.allMatch) { // all attributes for a record match a filter
                    keys.every((key) => {
                        try {
                            value = record[key].toString();
                        } catch (e) {
                            console.log(key);
                            console.log(record.intId);
                            console.log(record[key]);
                        }
                        matches = this.matches(value, filters[key].value);
                        if (matches) return true;
                    }, this);
                    if (matches) {
                        _indices.push(index); // if all key-values match a record, add the index
                    }
                } else { // check for single record attribute match
                    keys.forEach((key) => {
                        value = record[key].toString();
                        if (this.matches(value, filters[key].value)) {
                            _indices.push(index);
                        }
                    }, this);
                }
            }, this);

            // Unique indices
            _indices = [...new Set(_indices)];

            // Get records by indices
            _indices.forEach(_index => {
                _records.push(this.copy(records[_index]));
            }, this);

            // Highlighting
            _records.forEach(record => {
                keys.forEach((key) => {
                    value = record[key].toString();
                    if (this.matches(value, filters[key].value)) {
                        record[key] = this.highlightTerm(value, filters[key].value);
                    }
                }, this);
            }, this);

            return _records;

        },

        _filterByObject: function (records, filters) { },

        toggleFilter: function (code) {
            this.columnFilters[code].active = !this.columnFilters[code].active;
            this.filterRecords();
        },

        matches: function (value, term, caseInsensitive = true) {
            return value.match(new RegExp(term, caseInsensitive ? 'gi' : 'g'));
        },

        isNumber: function (value) {
            return typeof value == 'number';
        },

        isString: function (value) {
            return (typeof value == 'string' || value instanceof String);
        },

        highlightTerm: function (value, term, allInstances = true) {
            if (this.isVoid(term === "")) {
                return value;
            }
            let retval = this.replace(value, term, this._highlightTerm);
            return retval;
        },

        _highlightTerm: function (term) {
            return `<span class="highlight">${term}</span>`;
        },
        /*
        replace: function(value, oldTerm, newTerm, allInstances = true, caseInsensitive = true) {
            //let _term = /{oldTerm}/i : oldTerm; // g = global, i = case insensitive
            let regExParams = caseInsensitive ? 'gi' : 'g';
            let regEx = new RegExp(oldTerm, regExParams);

            let retval = allInstances ? value.replaceAll(regEx, newTerm) : value.replace(regEx, newTerm);
            return retval;
        },
        */

        removeVoids: function (obj) {
            return Object.keys(obj).filter(key => {
                return !this.isVoid(obj[key]) && obj[key].active
            });
        },

        getFilterableColumns: function (columns) {
            let keys = [];
            columns.forEach(column => {
                if (column.filter) {
                    keys.push(column.code);
                }
            }, this);
            return keys;
        },

        isVoid: function (value) {
            return value === undefined || value === null || value === "";
        },

        getIndicesOf: function (value, term, caseSensitive = false) {

            let termLen = term.length;

            if (termLen == 0) {
                return [];
            }

            let startIndex = 0, index, indices = [];

            if (!caseSensitive) {
                if (this.isString(term)) { term = term.toLowerCase(); }
                if (this.isString(value)) { value = value.toLowerCase(); }
            }

            while ((index = value.indexOf(term, startIndex)) > -1) {
                indices.push(index);
                startIndex = index + termLen;
            }

            return indices;
        },

        replace: function (value, term, callback) {
            //let _term = /{oldTerm}/i : oldTerm; // g = global, i = case insensitive
            value = value.toString();
            let existingTerm;
            let regExParams = 'i'; //caseInsensitive ? 'gi' : 'g';
            let indices = this.getIndicesOf(value, term).reverse();
            let termLength = term.length;
            let regEx;
            indices.forEach(index => {
                //console.log(`${ term } ${ term.length } ${ termLength }`);
                existingTerm = value.substring(index, index + termLength);
                regEx = new RegExp(existingTerm, regExParams);
                value = this.replaceAt(value, index, termLength, callback != undefined ? callback(existingTerm) : existingTerm);
            }, this);
            let retval = value; //all ? value.replaceAll(oldTerm, newTerm) : value.replace(oldTerm, newTerm);
            return retval;
        },

        replaceAt: function (value, index, length, replacement) {

            if (index >= value.length) {
                return value.valueOf();
            }

            return value.substring(0, index) + replacement + value.substring(index + length);
        }

    },

};

/*
 _filter: function(records, filters) {
        
    let keys = this.removeVoids(filters); 	// the columns with a value present to filter
    let _indices = [];						// the indices of the matching records
    let _records = [];						// the record set derived from matching
    let value;                              // temp to hold value to check typeof string || !string
    let matches;                            // used to 
    console.log(keys);
    if (keys.length <= 0) {	// if there are no terms to filter for...
        return records; 		// return the records as is
    }
            
    // Matching
    records.forEach((record, index) => {
        if (this.allMatch) { // all attributes for a record match a filter
            keys.every((key) => {
                try {
                    value = record[key].toString();
                } catch (e) {
                    console.log(key);
                    console.log(record.intId);
                    console.log(record[key]);
                }
                matches = this.matches(value, filters[key].value);
                return matches;
                //matches(this.matches(value, filters[key]));
            }, this);
            if (matches) _indices.push(index); // if all key-values match a record, add the index
        } else { // check for single record attribute match
            keys.forEach((key) => {
                value = record[key].toString();
                if (this.matches(value, filters[key].value)) {
                    _indices.push(index);
                }
            }, this);
        }
    }, this);
            
    // Unique indices
    _indices = [...new Set(_indices)];
            
    // Get records by indices
    _indices.forEach(_index => {
        _records.push(this.copy(records[_index]));
    }, this);
            
    // Highlighting
    _records.forEach(record => {
        keys.forEach((key) => {
            value = record[key].toString();
            if (this.matches(value, filters[key].value)) {
                record[key] = this.highlightTerm(record[key], filters[key].value);
            }
        }, this);
                
    }, this);
            
    return _records;
            
},
 */