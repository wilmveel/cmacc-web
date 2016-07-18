var mergeJson = require("merge-json");

var helper = {

    mergeJson: function (obj1, obj2) {
        return mergeJson.merge(obj1, obj2);
    },

    queryAst: function (ast, key) {
        var current = ast;
        var keys = key.split('.');

        for (var i in keys) {
            var k = keys[i]
            if (current.variables.hasOwnProperty(k)) {
                if (current.variables[k].ast) {
                    current = current.variables[k].ast;
                }
            }
            //else
            //throw new Error("cannot find key: " + key);

        }

        if (current.variables[k])
            return current.variables[k].val;
        else
            return;
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