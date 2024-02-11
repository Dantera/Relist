
export default {

    //props: ['reference'],

    data() {return {

    };},

    methods: {
        goFirstPage() {},
        goPreviousPage() {},
        goNextPage() {},
        goLastPage() {},

        filterRecords() {},
        clearSearch() {},
    },

    computed: {
        ref() {
            return this.parent.records;
        },
        parent() {
            return this.$parent;
        },
        root() {
            return this.$root;
        },
        sort() {
            return this.ref.Sort;
        },
        filter() {
            return this.ref.Filter;
        },
        pagination() {
            return this.ref.Paginate;
        },
        
        onFirstPage() {},
        onLastPage() {},
        hasPreviousPage() {},
        hasNextPage() {},

        recordsAvailable() {
            return true;
        },
        metricsFiltered() {},  
        
    },

    template: `
<div class="row pagination-metrics" v-if="ref.recordsAvailable">
            
    <div class="col text-center" v-if="filter.getFilterType() == 'MASTER'">
        <label class="control-label fw-bold">
            <i class="material-icons-outlined non-clickable">{{ sort.icons.filter }}</i>Search
        </label>
        <br>
        <div class="input-group">
            <input id="searchBox" type="text" class="form-control" v-model="filter.master" @keyup="parent.filterRecords()">
            <span class="input-group-btn">
                <button id="clearButton" class="btn" :class="root.buttonClass('danger')" v-on:click="clearSearch()">Clear</button>
            </span>
        </div>
    </div>

    <div class="col text-center">

        <div class="row" v-if="ref.recordsAvailable">
            <div class="col text-center pagination-nav">
        
                <button :class="$root.buttonClass('primary')"
                    @click="pagination.goFirstPage()"
                    :disabled="pagination.onFirstPage">
                    <i class="material-icons fitMIcon">{{ pagination.icons.start }}</i>
                </button>

                <button :class="$root.buttonClass('primary')"
                    @click="pagination.goPreviousPage()"
                    :disabled="!pagination.hasPreviousPage">
                    <i class="material-icons fitMIcon">{{ pagination.icons.previous }}</i>
                    </button>

                <span class="pagination-nav-metric">
                    <i class="material-icons fitMIcon non-clickable">{{ pagination.icons.page }}</i>
                    <label class="control-label fw-bold">Page</label><br />
                    {{ pagination.metricPages }}
                </span>

                <button :class="$root.buttonClass('primary')"
                    @click="pagination.goNextPage()"
                    :disabled="!pagination.hasNextPage">
                    <i class="material-icons fitMIcon">{{ pagination.icons.next }}</i>
                </button>
                        
                <button :class="$root.buttonClass('primary')"
                    @click="pagination.goLastPage()"
                    :disabled="pagination.onLastPage">
                    <i class="material-icons fitMIcon">{{ pagination.icons.end }}</i>
                </button>

            </div>
        </div>

    </div>

    <div class="col text-center">
        <label class="control-label fw-bold">
            <i class="material-icons-outlined non-clickable">{{ sort.icons.viewing }}</i>Showing
        </label>
        <br>
        {{ pagination.metricRecords }}
    </div>

    <div class="col text-center">
        <label class="control-label fw-bold">
            <i class="material-icons-outlined non-clickable">{{ sort.icons.source }}</i>Records
        </label>
        <br>
        {{ pagination.metricFiltered }}
    </div>

</div>
`
};
