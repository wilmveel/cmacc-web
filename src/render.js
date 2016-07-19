var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var render = function (ast, callback) {

    var exec = {};
    if(ast.text) {


        ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key) {

            exec[key] = function (callback) {

                var res = helper.queryAst(ast, key) || {};

                if (res && res.ast) {
                    return render(res.ast, function (ast, text) {
                        callback(null, text)
                    });
                }

                callback(null, res.val || "!!" + key + "!!");

            };
            return found;

        });

        async.series(exec, function (err, res) {

            var text = ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key) {
                var inject = res[key];

                if (prefix)
                    inject = inject.replace(/^/gm, prefix);

                return enter + inject;
            });
            callback(null, text)
        });
    }

};

module.exports = render;