
export default {

    data: function () {
        return {
            pagination: {
        	    perPage: 25,
                page: 1,
                icons: {
                    start: 'skip_previous',
                    previous: 'fast_rewind',
                    next: 'fast_forward',
                    end: 'skip_next',
                }
            }
        };
    },

    methods: {

        limit: function (data) {
            let i = this.searchIndex;
            return data.slice(i, i + this.pagination.perPage);
        },

        gotoPage: function (n) { // TODO: might be able to get rid of this method
            this.page = n;
        },

        viewPage: function (records) {
            if (this.pagination.page > this.pageCount) {
                this.pagination.page = this.pageCount;
            } else if (this.pagination.page < 1) {
                this.pagination.page = 1;
            }
            this.records.subset = this.limit(this.records.modified); //.slice(this.searchIndex, this.lastPageResult);
        },

        goPreviousPage: function () {
            if (this.hasPreviousPage) {
                this.pagination.page--;
                this.viewPage();
            }
        },

        goNextPage: function () {
            if (this.hasNextPage) {
                this.pagination.page++;
                this.viewPage();
            }
        },

        goFirstPage: function () {
            if (!this.onFirstPage) {
                this.pagination.page = 1;
                this.viewPage();
            }
        },

        goLastPage: function () {
            if (!this.onLastPage) {
                this.pagination.page = this.pageCount;
                this.viewPage();
            }
        }

    },

    computed: {
        
        currentRecord: function () {
            return this.searchIndex + 1;
        },

        currentPage: function () {
            return this.pagination.page;
        },

        onFirstPage: function () {
            return this.currentPage <= 1;
        },

        onLastPage: function () {
            return this.currentPage >= this.pageCount;
        },

        searchIndex: function () {
            return (this.currentPage - 1) * this.pagination.perPage;
        },

        pageCount: function () {
            return Math.ceil(this.records.modified.length / this.pagination.perPage);
        },

        hasPreviousPage: function () {
            return this.pagination.page > 1;
        },

        hasNextPage: function () {
            return this.pagination.page < this.pageCount;
        },
        
        lastPageResult: function() {
            let lastPageRecordCount = this.searchIndex + this.pagination.perPage; // get the index for the starting record
            let actualSubsetRecordCount = this.records.subset.length;
            return (lastPageRecordCount < actualSubsetRecordCount) ? lastPageRecordCount : actualSubsetRecordCount;
        },

        metricFiltered: function () {
            return `${this.records.modified.length} / ${this.records.original.length}`;
        },

        metricRecords: function () {
            return (this.records.subset.length > 0)
                ? `${this.currentRecord} - ${this.searchIndex + this.records.subset.length}`
                : '0 - 0';
        },

        metricPages: function () {
            return (this.records.subset.length > 0)
                ? `${this.currentPage} / ${this.pageCount}`
                : '0 / 0';
        },

    },

};
