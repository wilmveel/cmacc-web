var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var render = function (ast, callback) {

    var exec = {};
    ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key){

        exec[key] = function (callback) {

            if (ast.variables[key] && ast.variables[key].ast) {
                return render(ast.variables[key].ast, function (ast, text) {
                    callback(null, text)
                });
            }

            callback(null, helper.queryJson(ast.data, key) || "!!" + key + "!!");

        };
        return found;

    });

    async.series(exec, function (err, res) {

        var text = ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key){
            var inject = res[key];

            if (prefix)
                inject = inject.replace(/^/gm, prefix);

            return enter + inject;
        });
        callback(null, text)
    });

};

module.exports = render;