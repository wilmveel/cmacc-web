var helper = {

    mergeJson: function (obj1, obj2) {
        function walk(obj, base) {
            for (var key in obj) {
                if (obj1.hasOwnProperty(key)) {
                    var val = obj[key];
                    walk(val, base + '.' + key);
                    obj1[key] = obj2[key];
                }
            }
        }
        walk(obj1);
        return obj1
    },

    queryJson: function (json, key) {
        var current = json;
        var keys = key.split('.');

        for (var i in keys) {
            if (!current.hasOwnProperty(keys[i]))
                throw new Error("cannot find key: " + key);
            current = current[keys[i]];
        }
        return current;
    }
};

module.exports = helper;