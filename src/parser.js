var fs = require('fs');

var regex = require('./regex');

var parser = function(file, callback){

    var node = {
        file: file,
        variables : {},
        text: null
    };

    fs.readFile(file, 'utf8', function (err, text) {

        if(err) return callback(err)

        text = text.replace(regex.REGEX_VARIABLE, function (found, key, ref, val) {
            node.variables[key] = {
                key: key,
                ref: ref,
                val: val
            };
            return '';
        });

        node.text = text;

        callback(null, node);

    });
};

module.exports = parser;