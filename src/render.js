var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var render = function (ast, callback, editor) {

    var exec = {};


    ast.text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key) {

        exec[key] = function (callback) {

            var res = helper.queryAst(ast, key, true) || {};

            if (res.text) {
                return render(res, function (ast, text) {
                    callback(null, text)
                }, editor);
            }

            var text = null;

            if (editor)
                text = "<cmacc-variable ref='" + res.loc + "'>" + (res.val || "!!" + key + "!!") + "</cmacc-variable>";
            else
                text = res.val || found;

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

        if (editor) {
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
        }

        callback(null, text)
    });


};

module.exports = render;