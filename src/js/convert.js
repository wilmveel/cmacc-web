var fs = require('fs');
var path = require('path');

var regex = require('../regex');

function convert(file) {
    var res = '';

    var text = fs.readFileSync(file, 'utf8');

    var md = text.replace(regex.REGEX_VARIABLE, function (match, key, ref, val) {
        res += 'var ' + key + ' = {' + '\n';
        if (ref) res += '\tfile : "' + ref + '",\n';
        if (val) res += '\tvars : ' + val + '\n';
        res += '};\n\n';
        return ''
    });

    res += 'module.exports = "' + md.replace(/\n/g, '\\n') + '";';

    return res;
}

var js = convert(path.join(__dirname + '/../../doc/test.md'));
console.log(js);

module.exports = convert;
