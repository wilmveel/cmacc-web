var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var resolve = function (variable, ast, callback) {

    if(variable.type)
        return callback(null, variable);

    if (!variable.val) {
        variable.val = null;
        variable.type = 'null';
        return callback(null, variable);
    }

    if (variable.val.match(regex.REGEX_STRING)) {
        variable.val = variable.val.match(regex.REGEX_STRING)[1];
        variable.type = 'string';
        return callback(null, variable);
    }

    variable.val.replace(regex.REGEX_KEYVALUE, function (found, key, val) {

        variable.ast = variable.ast || {};
        variable.ast.variables = variable.ast.variables || [];

        var key = key.match(regex.REGEX_STRING)[1];

        if (val === "null") {
            variable.ast.variables.push({
                type:'null',
                key: key,
                val: null
            });
            return found;
        }

        if (val.match(regex.REGEX_STRING)) {
            var val = val.match(regex.REGEX_STRING)[1];
            variable.ast.variables.push({
                type:'string',
                key: key,
                val: val
            });
            return found;
        }

        var res = helper.queryAst(ast, val);
        res.type = 'ref';
        variable.ast.variables.push(res);


        return found;

    });

    callback(null, variable)
};

module.exports = resolve;