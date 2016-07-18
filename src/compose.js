var path = require('path');
var async = require('async');

var helper = require('./helper');
var parser = require('./parser');
var resolve = require('./resolve');

var i = 0;
var compose = function (file, parent, callback) {
    i++;
    console.log("file", i, file)

    parser(file, function (err, ast) {

        if (err)
            return callback(err);

        if (parent) {
            parent.file = ast.file;
            parent.text = ast.text;
            Object.keys(ast.variables).forEach(function (i) {
                if (!parent.variables[i])
                    parent.variables[i] = ast.variables[i]
            });
            ast = parent
        }

        var exec = {};
        Object.keys(ast.variables).forEach(function (i) {
            exec[ast.variables[i].key] = function (callback) {
                resolve(ast.variables[i], ast, function (err, data) {

                    if (ast.variables[i].ref && ast.variables[i].type !== 'ref') {
                        var location = path.resolve(path.dirname(ast.file), ast.variables[i].ref);
                        compose(location, ast.variables[i].ast, function (err, res) {
                            callback();
                        });
                    } else {
                        callback();
                    }
                });
            }
        });


        async.series(exec, function (err, variables) {
            callback(null, ast);
        });

    });

}

module.exports = compose;