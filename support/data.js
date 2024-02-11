
let data = [];

let range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let id = 0;
let fkid;

range.forEach(r1 => {
    range.forEach(r2 => {
        range.forEach(r3 => {
            id++;
            fkid = 2 - (id % 2);
            data.push({
                id: id,
                fkid: fkid,
                noSort: id,
                noFilter: id,
                field1: r1,
                field2: r2,
                field3: r3
            });
            /*
            range.forEach(r4 => {
                data.push({field1: r1, field2: r2, field3: r3, field4: r4});
            });
            */

        });
    });
});

export default data;