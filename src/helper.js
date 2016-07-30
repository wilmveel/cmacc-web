var mergeJson = require("./merge");

var helper = {

    mergeJson: function (obj1, obj2) {
        return mergeJson.merge(obj1, obj2);
    },

    queryAst: function (ast, key, link) {

        var res = null;
        var current = ast;

        var keys = key.split('.');
        for (var i in keys) {
            var key = keys[i];
            if (current.variables) {
                current.variables.forEach(function (v, k) {
                    if (v.key === key) {
                        var variable = current.variables[k]
                        if (link && variable.link) {
                            while(variable.link){
                                variable = variable.link;
                                res = variable;
                                current = variable;
                            }
                        } else {
                            res = variable;
                            current = variable;
                        }

                    }
                });
            }
        }

        return res;
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