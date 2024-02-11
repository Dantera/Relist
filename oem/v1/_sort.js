
const ASC = true;
const DESC = false;

export default {

    data: function () {
        return {
            sort: {
                by: '',
                default: '',
                direction: ASC,
                 // Google Material Icons
                icons: {
                    asc: 'expand_less',
                    desc: 'expand_more',
                    default: 'unfold_more',
                    filter: 'search',
                    viewing: 'manage_search',
                    source: 'storage'
                }
            },
        };
    },

    methods: {

        switchDirection: function() {
            this.sort.direction = !this.sort.direction;
        },
        
        direction: function(records) {
            if (this.sort.direction == ASC) return records;
            return records.reverse();
        },

    	sortRecords: function() {
        	if (this.sort.term !== "") {
                this.records.modified = this.sortToResults(this.records.modified); //original);
            } else {
                this.records.modified = this.loadFrom(this.records.modified); //original);
            }
            this.viewPage(this.results);
        },

        getSortOrder: function() {
        
        },
        
        sortToResults: function(records) {
        	let results = this.filter(this.copy(records), this.getSortOrder(this.search.sortBy), this.search.term);
            let finalResults = [];
            for (let i in results) {
                results[i].sort(this._byValue(i)).sort(this._byPosition(i, this.search.term));
                finalResults = finalResults.concat(results[i]);
            }
            return finalResults;
        },
        
        isSortBy: function(sortBy) {
        	return this.sort.by === sortBy;
        },
        
        updateSortBy: function(sortBy) {
        	this.sort.by = sortBy;
            this.sort();
        },

        getDirectionIcon: function() {
            return this.sort.direction ? this.icons.asc : this.icons.desc;
        },

        sortByField: function (column) {

            if (!column.sort) { return; }

            if (this.sort.by == column.code) {
                this.switchDirection();
            }

            this.sort.by = column.code;

            if (column.code !== '') {
                this.records.modified.sort(this.byValue(this.sort.by));
            } else {
                this.records.modified.sort(this.byValue(this.sort.default));
            }

            this.records.subset = this.limit(this.direction(this.records.modified));
        },

        byValue: function(value) {
        	return function(a, b) {
            	if (a[value] > b[value]) {
                    return 1;
                } else if (a[value] < b[value]) {
                    return -1;
                }
                return 0;
            };
        },
        
        byPosition: function(sortBy, term) {
            return function(a, b) {
                let aPosition = a[sortBy].indexOf(term);
                let bPosition = b[sortBy].indexOf(term);
                if ((aPosition === -1 && bPosition !== -1) || aPosition > bPosition)	{// a no, b yes || a is greater (alphanumerically later)
                    return 1;
                } else if ((aPosition !== -1 && bPosition === -1) || aPosition < bPosition) {// a yes, b no || a is lesser (alphanumerically earlier)
                    return -1;
                }
                return 0; // a and b are equal
            };
        },

    }

};
