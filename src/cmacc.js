var fs = require('fs');
var path = require('path');
var async = require('async');

var REGEX_VARIABLE = /^\$\s?(\w*)\s?\=\s?(?:\[([\.\w\/]*)\])?(?:\s\=\>\s)?((?:null)|(?:".*")|(?:\{[^}]*[\s?\n?\}]*))?$/gm;

var REGEX_KEYVALUE = /("\w*"\s?:\s?)([\w\.]*)?(?:\[([\.\w\/]*)\])?/g


var cmacc = {

    parse: function (file, data, callback) {

        function mergeJson(obj1, obj2) {
            var result = {};
            for (var key in obj1) result[key] = obj1[key];
            for (var key in obj2) result[key] = obj2[key];
            return result
        }

        function queryJson(json, key) {
            var current = json;
            var keys = key.split('.');

            for (var i in keys) {
                if (!current[keys[i]] && current[keys[i]] !== null)
                    throw new Error("cannot find key: " + key);
                current = current[keys[i]];
            }

            return current;
        }

        function resolveValue(value, data, callback) {

            var match;
            var exec = [];
            while ((match = REGEX_KEYVALUE.exec(value)) !== null) {
                (function () {

                    var found = match[0];
                    var key = match[1];
                    var val = match[2];
                    var ref = match[3];

                    exec.push(function (callback) {

                        if (val) {
                            if(val === 'null')
                                callback(null, key + "null");
                            else
                                callback(null, key + "\"" + queryJson(data, val) + "\"");
                        }

                        else if (ref) {
                            var location = path.resolve(path.dirname(file), ref)
                            cmacc.parse(location, null, function (err, res) {
                                callback(null, key + JSON.stringify(res));
                            });
                        }

                        else {
                            callback(null, found);
                        }
                    })
                })()
            }

            async.series(exec, function (err, res) {



                if (err) return callback(err);

                if (!value)
                    return callback(null, value)

                var i = 0;

                value = value.replace(REGEX_KEYVALUE, function (found, key, val, ref) {
                    var val = res[i]
                    i++;
                    return val

                });

                callback(null, JSON.parse(value))
            });

        }

        if (!data) data = {};

        fs.readFile(file, 'utf8', function (err, text) {

            if (err) return callback(err);

            var match;
            var exec = {};
            var temp = {};
            while ((match = REGEX_VARIABLE.exec(text)) !== null) {
                (function () {

                    var key = match[1];
                    var ref = match[2];
                    var value = match[3];

                    exec[key] = function (callback) {

                        resolveValue(value, temp, function (err, value) {

                            if (!ref) {
                                temp[key] = value;
                                callback(null, value);
                            }


                            else {
                                var location = path.resolve(path.dirname(file), ref)
                                cmacc.parse(location, value, function (err, data) {
                                    if (err) return callback(err);

                                    // merge data with parsed value
                                    if (typeof value === 'object')
                                        data = mergeJson(data, value);

                                    callback(null, data);

                                });
                            }
                        });
                    };
                })();
            }

            async.series(exec, function (err, data) {
                if (err) return callback(err);
                callback(null, data);
            });
        });
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