var path = require('path');
var async = require('async');

var helper = require('./helper');
var parser = require('./parser');
var resolve = require('./resolve');

var compose = function (file, data, callback) {

    data = data || {}
    parser(file, function (err, ast) {

        ast.data = {};

        var exec = {};
        Object.keys(ast.variables).forEach(function (i) {

            var variable = ast.variables[i];

            exec[variable.key] = function (callback) {

                resolve(variable.val, ast.data, function (err, res) {
                    var merge = helper.mergeJson(res, data[variable.key]) || res
                    if (variable.ref) {
                        var location = path.resolve(path.dirname(file), variable.ref)
                        compose(location, merge, function (err, com) {
                            variable.ast = com;
                            ast.data[variable.key] = com.data;
                            callback(null, com.data);
                        })
                    }else {
                        ast.data[variable.key] = merge;
                        callback(null, merge);
                    }
                })
            };
        });

        async.series(exec, function (err, res) {
            callback(null, ast)
        });

    })
};

module.exports = compose;