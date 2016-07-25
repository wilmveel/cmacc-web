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

        source += "\n\n"
    });

    callback(null, source)
};

var json = function (variables) {

    var res = '{';

    variables.forEach(function (variable) {
        if(variable.link){
            res += "\n\t\"" + variable.key + "\"" + ' : ';
            res +=  variable.val + "\n";
        }

    });

    res += '}';

    return res
}

module.exports = serialize;