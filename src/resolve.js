var path = require('path');
var async = require('async');

var regex = require('./regex');
var helper = require('./helper');

var resolve = function (val, data, callback) {

    var match;

    if (!val) {
        return callback(null, null);
    }

    if (match = val.match(regex.REGEX_STRING))
        return callback(null, match[1]);

    var res = val.replace(regex.REGEX_KEYVALUE, function (found, key, val) {

        if(val === "null")
            return key + " : null";

        if (val.match(regex.REGEX_STRING))
            return key + " : " + val;

        var res = helper.queryJson(data, val)
        return key + " : " + JSON.stringify(res)


    });

    callback(null, JSON.parse(res))
};

module.exports = resolve;