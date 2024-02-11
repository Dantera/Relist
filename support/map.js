
export default [
	{ visible: true, type: 'int', key: 'id', display: 'ID', isPK: true },
    { visible: true, type: 'int', key: 'fkid', display: 'FKID', fk: 'fkrecords' },
    { visible: true, type: 'int', key: 'noSort', display: 'No Sort' },
    { visible: true, type: 'int', key: 'noFilter', display: 'No Filter' },
    { visible: true, sort: true, filter: true, type: 'string', key: 'field1', display: 'Field 1' },
    { visible: true, sort: true, filter: true, type: 'string', key: 'field2', display: 'Field 2' },
    { visible: true, sort: true, filter: true, type: 'string', key: 'field3', display: 'Field 3' },
    //{ visible: true, sort: false, filter: true, active: false, type: 'string', key: 'field4', display: 'Field 4' },
];
