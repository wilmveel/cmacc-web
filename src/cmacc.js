var fs = require('fs');
var path = require('path');
var async = require('async');

var marked = require('marked');

var REGEX_VARIABLE = '\\$\\s(\\w*)\\s?=\\s?((?:\\{[^}]*[\\s?\\n?\\}]*)|\\"(?:.*)\\"|(?:null))\\n?\\n?';

var REGEX_IMPORT = '\\@?\\s(\\w*)\\s?=\\s?\\[([\\w\\/\\.]*)\\](?:\\s\\=\\>\\s)?(\\{[^}]*[\\s?\\n?\\}]*|\\".*\\"|null)?\\n?\\n?';

var REGEX_INJECT = '(\\n?)((?:\\s{4}|\\t)*)?\\{\\{([\\w\\.]*)\\}\\}';

var REGEX_KEYVALUE = '(\\"\\w*\\")(\\s?\\:\\s?)([\\w\\.]*)';

function queryJson(json, key){
    var current = json;
    var keys = key.split('.');

    //console.log(key, json);

    for (var i in keys) {

        if(!current[keys[i]] && current[keys[i]] !== null)
            throw new Error("cannot find key: " + key);

        current = current[keys[i]];

    }

    return current;
}

var cmacc = {

    parse: function (file, js, callback) {

        var node = {};

        fs.readFile(file, 'utf8', function (err, text) {

            if (err) return callback(err);

            var exec = {};

            // replace variable
            text.replace(new RegExp(REGEX_VARIABLE, 'g'), function (variable) {

                var result = variable.match(new RegExp(REGEX_VARIABLE));


                var key = result[1];
                var json = JSON.parse(result[2]);

                exec[key] = function (callback) {

                    if (js[key]) {
                        json = js[key]
                        for (var i in js[key]) {
                            json[i] = js[key][i];
                        }
                    }

                    callback(null, json);
                };

            });


            async.parallel(exec, function (err, variables) {

                if(err) return callback(err);

                var exec = {};

                // replace import
                text.replace(new RegExp(REGEX_IMPORT, 'g'), function (imprt) {

                    var result = imprt.match(new RegExp(REGEX_IMPORT));
                    var key = result[1];
                    var file2 = path.resolve(path.dirname(file), result[2]);

                    var json = {};
                    if(result[3]) {
                        json = result[3].replace(new RegExp(REGEX_KEYVALUE, 'g'), function (kv) {

                            return kv.replace(new RegExp(REGEX_KEYVALUE), function (found, key, col, value) {
                                if (value) {
                                    return key + " : " + JSON.stringify(queryJson(variables, value));
                                }
                                else {
                                    return found
                                }

                            })
                        });

                        json = JSON.parse(json);
                    }

                    exec[key] = function (callback) {
                        cmacc.parse(file2, json, function (err, json) {
                            callback(null, json)
                        });
                    };

                });

                async.parallel(exec, function (err, res) {
                    for (var i in variables) {
                        res[i] = variables[i];
                    }
                    //console.log(res)
                    callback(null, res);
                });

            });

        })
    },

    render: function (file, json, callback) {

        fs.readFile(file, 'utf8', function (err, text) {

            if(err) return callback(err);

            var exec = {};

            // replace import
            text.replace(new RegExp(REGEX_IMPORT, 'g'), function (imprt) {

                var result = imprt.match(new RegExp(REGEX_IMPORT));
                var key = result[1];
                var file2 = path.resolve(path.dirname(file), result[2]);

                exec[key] = function (callback) {
                    cmacc.render(file2, json[key], function (err, markdown) {
                        callback(null, markdown)
                    });
                };

            });

            async.parallel(exec, function (err, res) {

                if(err) return callback(err);

                text = text.replace(new RegExp(REGEX_VARIABLE, 'g'), '');
                text = text.replace(new RegExp(REGEX_IMPORT, 'g'), '');
                text = text.replace(new RegExp(REGEX_INJECT, 'g'), function (found, enter, prefix, key) {

                    if (res[key]) {
                        var inject = res[key];

                        if(prefix)
                            inject = inject.replace(/^/gm, prefix);

                        return enter + inject;
                    }
                    else {
                        return queryJson(json, key) || "!!" + key + "!!";
                    }
                });

                callback(null, text)
            });

        });

    }
};

module.exports = cmacc;