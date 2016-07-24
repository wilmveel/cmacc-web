var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var serialize = function (ast, callback) {

    var source = "";
    ast.variables.forEach(function(variable){

        source += "$ " + variable.key + " = ";

        if(variable.ref)
            source += "[" + variable.ref + "] => ";

        source += " " + variable.val;
        source += "\n\n"
    });

    callback(null, source)
};

module.exports = serialize;