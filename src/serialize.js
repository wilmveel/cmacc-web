var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var serialize = function (ast, callback) {

    var source = "";
    ast.variables.forEach(function (variable) {

        source += "$ " + variable.key + " = ";


        if (variable.ref)
            source += "[" + variable.ref + "] => ";

        if (variable.variables)
            source += json(variable.variables);
        else
            source += "\"" + variable.val + "\"";

        source += "\n\n";
    });

    source += ast.text + "\n"

    callback(null, source)
};

var json = function (variables) {

    var res = '';
    if (variables.length > 0) {
        res += '{';
        variables.forEach(function (variable) {
            if (variable.over) {
                res += "\n\t\"" + variable.key + "\"" + ' : ';
                if (variable.type === 'string')
                    res += "\"" + variable.val + "\"";
                else
                    res += variable.val;
            }
        });
        res += "\n" + '}';
    }

    return res
}

module.exports = serialize;