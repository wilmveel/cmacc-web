var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var resolve = function (variable, ast, callback) {

    if (!variable.val) {
        return callback(null, variable);
    }

    if (variable.val.match(regex.REGEX_STRING)) {
        variable.type = 'string';
        return callback(null, variable);
    }

    ast.variables = ast.variables || {};

    variable.val.replace(regex.REGEX_KEYVALUE, function (found, key, val) {

        variable.ast = variable.ast || {};
        variable.ast.variables = variable.ast.variables || {};

        var key = key.match(regex.REGEX_STRING)[1];

        if (val === "null") {
            variable.ast.variables[key] = {
                type:'null',
                key: key,
                val: null
            };
            return found;
        }

        if (val.match(regex.REGEX_STRING)) {
            var val = val.match(regex.REGEX_STRING)[1];
            variable.ast.variables[key] = {
                type:'string',
                key: key,
                val: val
            };
            return found;
        }

        variable.ast.variables[key] = ast.variables[val];
        variable.ast.variables[key].type = 'ref';

        return found;

    });

    callback(null, variable)
};

module.exports = resolve;