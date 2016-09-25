var merge = require('../src/merge');

describe('merge', function () {
    it('flat', function () {
        var obj1 = {
            test1 : 'test1'
        };

        var obj2 = {
            test2 : 'test2'
        };

        console.log(merge.merge(obj1, obj2))
    });

    it('deep', function () {
        var obj1 = {
            test1 : {
                hoi: 'test1'
            }
        };

        var obj2 = {
            test1 : {
                doei: 'test2'
            }
        };

        console.log(merge.merge(obj1, obj2))
    });
});