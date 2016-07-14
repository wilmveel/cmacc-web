var helper = {

    mergeJson: function (obj1, obj2) {
        if(obj2 === null){
            console.log('lalalala');
        }
        return mergeJson.merge(obj1, obj2)
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