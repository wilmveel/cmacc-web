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
            var variables = [];
            ast.variables.forEach(function (item, i) {
                var inject = helper.queryAst(parent, item.key)
                if (inject)
                    variables.push(inject);
                else
                    variables.push(item);
            });

            parent.file = ast.file;
            parent.text = ast.text;
            parent.variables = variables;
            ast = parent;
        }

        var exec = [];
        ast.variables.forEach(function (item, i) {
            exec.push(function (callback) {
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
            });
        });

        async.series(exec, function (err, variables) {
            callback(null, ast);
        });

    });

}

module.exports = compose;