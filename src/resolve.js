var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var resolve = function (variable, ast, callback) {

    if(variable.type)
        return callback(null, variable);

    if(ast.loc)
        variable.loc = ast.loc + "." + variable.key
    else
        variable.loc = variable.key

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

        variable = variable || {};
        variable.type = 'object';
        variable.variables = variable.variables || [];

        var key = key.match(regex.REGEX_STRING)[1];

        if (val === "null") {
            variable.variables.push({
                type:'null',
                key: key,
                val: null,
                loc: ast.loc + "." + key,
                over: true
            });
            return found;
        }

        if (val.match(regex.REGEX_STRING)) {
            var val = val.match(regex.REGEX_STRING)[1];
            variable.variables.push({
                type:'string',
                key: key,
                val: val,
                loc: variable.loc + "." + key,
                over: true
            });
            return found;
        }



        var res = helper.queryAst(ast, val, true);
        variable.variables.push({
            type:'ref',
            key: key,
            val: val,
            loc: variable.loc + "." + key,
            link: res,
            over: true
        });

        return found;

    });

    callback(null, variable)
};

module.exports = resolve;