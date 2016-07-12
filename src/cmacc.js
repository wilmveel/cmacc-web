var fs = require('fs');
var path = require('path');
var async = require('async');

var marked = require('marked');

var REGEX_VARIABLE = /^\$\s?(\w*)\s?\=(?:\s?\[([\.\w\/]*)\])?\s?\=?\>?\s?((?:".*")|(?:\{[^}]*[\s?\n?\}]*))?\n$/gm;

function mergeJson(obj1, obj2) {
    var result = {};
    for (var key in obj1) result[key] = obj1[key];
    for (var key in obj2) result[key] = obj2[key];
    return result
}

var cmacc = {

    parse: function (file, data, callback) {

        if (!data) data = {};

        fs.readFile(file, 'utf8', function (err, text) {

            if (err) return callback(err);

            var match;
            var exec = {};
            while ((match = REGEX_VARIABLE.exec(text)) !== null) {
                (function () {

                    var name = match[1];
                    var ref = match[2];
                    var value = match[3];

                    exec[name] = function (callback) {

                        if(value)
                            value = JSON.parse(value);

                        if (!ref) {
                            callback(null, value);
                        }
                        else {
                            var location = path.resolve(path.dirname(file), ref)
                            cmacc.parse(location, value, function (err, data) {
                                if (err) return callback(err);

                                if (typeof value === 'object')
                                  data = mergeJson(data, value);

                                console.log(file, name, value, data);

                                callback(null, data)
                            });
                        }
                    };
                })();
            }


            async.parallel(exec, function (err, data) {
                if (err) return callback(err);
                callback(null, data);
            });

        })
    },

    resolve: function () {

    }

};

module.exports = cmacc;