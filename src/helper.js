var mergeJson = require("merge-json");

var helper = {

    mergeJson: function (obj1, obj2) {
        return mergeJson.merge(obj1, obj2);
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
    },

    hashCode: function () {
        var hash = 0, i, chr, len;
        if (this.length === 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
};

module.exports = helper;