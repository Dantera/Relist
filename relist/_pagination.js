
export default class Paginate {

    // Attributes

    records;

    perPage = 25;
    page = 1;
    icons = {
        start: 'skip_previous',
        previous: 'fast_rewind',
        next: 'fast_forward',
        end: 'skip_next',
    };


    // Constructor

    constructor(ref) {
        this.ref = ref;
        this.records = ref._records;
    }


    // Methods

    limit(data) {
        let i = this.searchIndex;
        return data.slice(i, i + this.perPage);
    }

    gotoPage(n) { // TODO: might be able to get rid of this method
        this.page = n;
    }

    viewPage(records) {
        if (this.page > this.pageCount) {
            this.page = this.pageCount;
        } else if (this.page < 1) {
            this.page = 1;
        }
        this.records.subset = this.limit(this.records.modified); //.slice(this.searchIndex, this.lastPageResult);
    }

    goPreviousPage() {
        if (this.hasPreviousPage) {
            this.page--;
            this.viewPage();
        }
    }

    goNextPage() {
        if (this.hasNextPage) {
            this.page++;
            this.viewPage();
        }
    }

    goFirstPage() {
        if (!this.onFirstPage) {
            this.page = 1;
            this.viewPage();
        }
    }

    goLastPage() {
        if (!this.onLastPage) {
            this.page = this.pageCount;
            this.viewPage();
        }
    }


    // Accessors

    get currentRecord() {
        return this.searchIndex + 1;
    }

    get currentPage() {
        return this.page;
    }

    get onFirstPage() {
        return this.currentPage <= 1;
    }

    get onLastPage() {
        return this.currentPage >= this.pageCount;
    }

    get searchIndex() {
        return (this.currentPage - 1) * this.perPage;
    }

    get pageCount() {
        return Math.ceil(this.records.modified.length / this.perPage);
    }

    get hasPreviousPage() {
        return this.page > 1;
    }

    get hasNextPage() {
        return this.page < this.pageCount;
    }

    get lastPageResult() {
        let lastPageRecordCount = this.searchIndex + this.perPage; // get the index for the starting record
        let actualSubsetRecordCount = this.records.subset.length;
        return (lastPageRecordCount < actualSubsetRecordCount) ? lastPageRecordCount : actualSubsetRecordCount;
    }

    get metricFiltered() {
        return `${this.records.modified.length} / ${this.records.original.length}`;
    }

    get metricRecords() {
        return (this.records.subset.length > 0)
            ? `${this.currentRecord} - ${this.searchIndex + this.records.subset.length}`
            : '0 - 0';
    }

    get metricPages() {
        return (this.records.subset.length > 0)
            ? `${this.currentPage} / ${this.pageCount}`
            : '0 / 0';
    }

};
