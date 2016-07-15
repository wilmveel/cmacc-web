var fs = require('fs');
var path = require('path');
var async = require('async');

var helper = require('./helper');
var regex = require('./regex');
var mergeJson = require("merge-json");


var cmacc = {

    parse: function (file, data, callback) {

        function resolveValue(value, data, callback) {

            var match;

            if(!value){
                return callback(null, null);
            }

            if(match = value.match(/^\"(\w+)\"$/))
                return callback(null, match[1]);

            var exec = [];
            while ((match = regex.REGEX_KEYVALUE.exec(value)) !== null) {
                (function () {

                    var key = match[1];
                    var val = match[2];
                    var ref = match[3];

                    exec.push(function (callback) {

                        if (ref) {
                            var location = path.resolve(path.dirname(file), ref)
                            cmacc.parse(location, data, function (err, res) {
                                 return callback(null, key + " : " + JSON.stringify(res));
                            });
                        }

                        if(val) {
                            if(val === "null")
                                return callback(null, key + " : " + "null");
                            else
                                return callback(null, key + " : " + JSON.stringify(helper.queryJson(data, val)));
                        }
                    })
                })()
            }

            async.series(exec, function (err, res) {

                if (err)
                    return callback(err);

                var i = 0;

                value = value.replace(regex.REGEX_KEYVALUE, function (found, key, val, ref) {
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
            while ((match = regex.REGEX_VARIABLE.exec(text)) !== null) {


                (function () {

                    var key = match[1];
                    var ref = match[2];
                    var value = match[3];

                    exec[key] = function (callback) {

                        if(data[key])
                            return callback();

                        resolveValue(value, data, function (err, value) {

                            if (!ref) {
                                data[key] = value;
                                callback(null, value);
                            }

                            else {
                                var location = path.resolve(path.dirname(file), ref)
                                cmacc.parse(location, value, function (err, data) {
                                    if (err) return callback(err);

                                    if (value && typeof value === 'object') {
                                        if (data === null)
                                            data = value;
                                        else
                                            data = mergeJson.merge(data, value);
                                    }

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

            if (err) return callback(err);

            var match;
            var exec = {};
            while ((match = regex.REGEX_VARIABLE.exec(text)) !== null) {
                (function () {

                    var key = match[1];
                    var ref = match[2];

                    if (ref) {



                        var file2 = path.resolve(path.dirname(file), ref);

                        exec[key] = function (callback) {
                            if(typeof json[key] === 'string')
                                return callback(null, json[key]);

                            cmacc.render(file2, json[key], function (err, markdown) {
                                return callback(null, markdown)
                            });
                        };
                    }
                })()
            }


            async.parallel(exec, function (err, res) {

                if (err) return callback(err);

                text = text.replace(regex.REGEX_VARIABLE, '');
                text = text.replace(regex.REGEX_INJECT, function (found, enter, prefix, key) {

                    if (res[key]) {
                        var inject = res[key];

                        if (prefix)
                            inject = inject.replace(/^/gm, prefix);

                        return enter + inject;
                    }
                    else {
                        return helper.queryJson(json, key) || "!!" + key + "!!";
                    }
                });

                callback(null, text)
            });

        });

    }
};

module.exports = cmacc;