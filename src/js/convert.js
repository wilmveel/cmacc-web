var fs = require('fs');
var path = require('path');

var regex = require('../regex');

var convert = function (file, callback) {
    var res = ''

    fs.readFile(file, 'utf8', function (err, text) {

        if (err)
            return callback(err)

        var md = text.replace(regex.REGEX_VARIABLE, function (match, key, ref, val) {
            res += 'var ' + key + ' = {' + '\n';
            if (ref) res += '\tfile : "' + ref + '",\n';
            if (val) res += '\tvars : ' + val + '\n';
            res += '};\n\n';
            return ''
        });

        res += 'module.exports = "' + md.replace(/\n/g, '\\n') + '";'

        callback(null, res)

    });
}

module.exports = convert;


convert('../../doc/test.md', function (err, js) {
    console.log(js)
});