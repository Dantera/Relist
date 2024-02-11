
export default {

    data: function () {
        return {
            selectedElementIndex: null,
            defaultSequenceKey: 'sequence'
        };
    },

    methods: {

        copy: function (value) { return JSON.parse(JSON.stringify(value)); },

        random: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },

        isString(value) {
            return value instanceof String;
        },

        alert: function (value) { alert(value); },

        format16ths: function (value) {
            return (value / 16).toFixed(3);
        },

        formatIn: function (value) {
            return (value / 1000.0).toFixed(3);
        },

        moveUpByProperty: function (arr, indexFrom, key) {
            let indexTo = indexFrom - 1;
            if (indexTo < 0) return;

            let itemFrom = arr[indexFrom];
            let itemTo = arr[indexTo];

            let propertyFrom = arr[indexFrom][key];
            let propteryTo = arr[indexTo][key];

            arr[indexFrom][key] = propertyTo;
            arr[indexTo][key] = propertyFrom;

            arr = this.sortElementsByProperty(arr, key);

        },


        // BEGIN: Array Manipulation

        elementIsSelected: function (index) {
            return this.selectedElementIndex === index;
        },

        selectElementByIndex: function (index) {
            this.selectedElementIndex = index;
        },

        deselectElement: function () {
            this.selectedElement = null;
        },

        selectElementByProperty: function (arr, value, key = 'id') {
            let index = arr.findIndex(element => element[key] == value);
            if (index >= 0 && index < arr.length) this.selectedElementIndex = index;
        },

        getElementByIndex: function (arr, index) {
            return arr[index];
        },

        getElementByProperty: function (arr, value, key = 'id') {
            return arr.find(element => element[key] === value);
        },

        getElementAt: function (arr, index) {
            return arr.splice(index, 1);
        },

        setElementAt: function (arr, element, index) {
            arr.splice(index, 0, element); // TODO: verify this works
        },

        moveElementTo: function (arr, indexFrom, indexTo) {
            this.setElementAt(arr, this.getElementAt(arr, indexFrom), indexTo);
        },

        moveElementUp: function (arr, index) {
            if (index === null) index = this.selectedElementIndex;
            if (index <= 0) return;
            let element = this.copy(arr[index]);
            arr.splice(index, 1);
            arr.splice(index - 1, 0, element);
            this.resequenceElements(arr);
            this.selectedElementIndex = index - 1;
        },

        moveElementDown: function (arr, index) {
            if (index === null) index = this.selectedElementIndex;
            if (index >= arr.length - 1) return;
            let element = this.copy(arr[index]);
            arr.splice(index, 1);
            arr.splice(index + 1, 0, element);
            this.resequenceElements(arr);
            this.selectedElementIndex = index + 1;
        },

        moveElementToTop: function (arr, index) {
            if (index === null) index = this.selectedElementIndex;
            if (index === 0) return;
            let element = this.copy(arr[index]);
            arr.splice(index, 1);
            arr.unshift(element);
            this.resequenceElements(arr);
            this.selectedElementIndex = 0;
        },

        moveElementToBottom: function (arr, index) {
            if (index === null) index = this.selectedElementIndex;
            if (index === arr.length - 1) return;
            let element = this.copy(arr[index]);
            arr.splice(index, 1);
            arr.push(element);
            this.resequenceElements(arr);
            this.selectedElementIndex = arr.length - 1;
        },

        resequenceElements: function (arr, key = this.defaultSequenceKey) {
            let n = 0;
            arr.forEach(element => {
                element[key] = ++n;
            })
        },

        sortElements: function (arr, key = this.defaltSequenceKey) {
            arr.sort((a, b) => {
                return a.sequence < b.sequence;
            });
        },

        // END: Array Manipulation

        compareArraysByKey(arr1, arr2, key) {
            /*
            let map1 = arr1.map(item => item[key]);
            let map2 = arr2.map(item => item[key]);
            let value1 = map1.join(',');
            let value2 = map2.join(',');
            return value1 === value2;
            */
            return arr1.map(item => item[key]).join(',') === arr2.map(item => item[key]).join(',');
        }

    },

};
