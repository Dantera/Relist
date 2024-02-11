
export default `
<div class="row">
        <div class="col-md-4">
            <h2>Job Lock</h2>
        </div>
        <div class="col-md-4">
            <br />
            <div class="input-group">
                <span class="input-group-btn">
                    <button id="searchButton" class="btn btn-default">Search</button>
                </span>
                <input id="searchBox" type="text" class="form-control pull-left" placeholder="Search" v-model="filter" v-on:keyup="filterRecords()">
                <span class="input-group-btn pull-left">
                    <button id="clearButton" class="btn btn-default" @click="clearSearch()">Clear</button>
                </span>
            </div>
        </div>
        <div class="col-md-4"></div>
    </div>

    <hr />

    <div class="row">

        <div class="col-md-6">
            <h3><i class="fa fa-unlock"></i> Open Jobs</h3>
            <table class="table table-condensed table-striped">
                <thead>
                    <tr>
                        <th>Job #</th>
                        <th>Job Name</th>
                        <th>Customer</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in open.records">
                        <td v-html="record._strJobNumber"></td>
                        <td v-html="record._strJobName"></td>
                        <td v-html="record._strCustomerName"></td>
                        <td class="text-right">
                            <button class="btn btn-danger"
                                    @click="lockRecord(record.strJobNumber)">
                                <i class="fa fa-arrow-right"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="col-md-6">
            <h3><i class="fa fa-lock"></i> Locked Open Jobs</h3>
            <table class="table table-condensed table-striped">
                <thead>
                    <tr>
                        <th></th>
                        <th>Job #</th>
                        <th>Job Name</th>
                        <th>Customer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in locked.records">
                        <td class="text-left">
                            <button class="btn btn-success"
                                    @click="unlockRecord(record.strJobNumber)">
                                <i class="fa fa-arrow-left"></i>
                            </button>
                        </td>
                        <td v-html="record._strJobNumber"></td>
                        <td v-html="record._strJobName"></td>
                        <td v-html="record._strCustomerName"></td>
                    </tr>
                    <tr v-if="locked.records.length == 0">
                        <td colspan="4" class="warning text-center">No Locked Open Jobs</td>
                    </tr>
                </tbody>
            </table>

        </div>

    </div>
`;
