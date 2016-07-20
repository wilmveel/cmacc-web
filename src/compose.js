var path = require('path');
var async = require('async');

var helper = require('./helper');
var parser = require('./parser');
var resolve = require('./resolve');

var compose = function (file, parent, callback) {

    parser(file, function (err, ast) {

        if (err)
            return callback(err);

        var variables = [];
        ast.variables.forEach(function (item, i) {
            if(parent && parent.ast) {
                var inject = helper.queryAst(parent.ast, item.key)
                if (inject) {
                    variables.push(inject);
                }
                else {
                    item.loc = parent.loc + "." + item.key
                    variables.push(item);
                }
            }else{
                item.loc = item.key;
                variables.push(item);
            }
        });

        if(parent  && parent.ast) {
            parent.ast.file = ast.file;
            parent.ast.text = ast.text;
            parent.ast.variables = variables;
            ast = parent.ast;
        }


        var exec = [];
        ast.variables.forEach(function (item, i) {
            exec.push(function (callback) {
                resolve(ast.variables[i], ast, function (err, data) {
                    if (ast.variables[i].ref && ast.variables[i].type !== 'ref') {
                        var location = path.resolve(path.dirname(ast.file), ast.variables[i].ref);
                        compose(location, ast.variables[i], function (err, res) {
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