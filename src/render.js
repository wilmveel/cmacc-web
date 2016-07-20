var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var render = function (ast, parent, callback) {

    if (callback == null){
        callback = parent;
        parent = null;
    }

    var exec = {};
    if (ast.text) {

        ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key) {

            exec[key] = function (callback) {

                var res = helper.queryAst(ast, key) || {};

                if (res && res.ast) {
                    return render(res.ast, ast, function (ast, text) {
                        callback(null, text)
                    });
                }

                var text = "<cmacc-variable ref='" + res.loc + "'>" + (res.val || "!!" + key + "!!") + "</cmacc-variable>"
                callback(null, text);

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

            text = text.replace(/^(.*)$/gm, function (found) {

                return found.replace(/^(\s*)((?:\>\s)|(?:\d\.\s))?(.*)$/, function (r, space, pre, cont) {
                    if (cont)
                        return (space || '') +
                            (pre || '') +
                            "<cmacc-section file='" +
                            ast.file +
                            "'>" + cont.trim() +
                            "</cmacc-section>" +
                            (cont.match(/(\ \ )?$/)[1] ? '  ' : '');
                    else
                        return ''
                });
            });

            callback(null, text)
        });
    }

};

module.exports = render;