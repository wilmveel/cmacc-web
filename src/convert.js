var fs = require('fs');
var path = require('path');
var url = require('url');

var marked = require('marked');
var regex = require('./regex');
var merge = require('./merge');
var imp = require('./import');

function convert(file) {
    var res = '';
    var vars = [];

    var text = null;

    try {
        text = fs.readFileSync(file, 'utf8');
    } catch (e) {
        throw(e)
    }

    var md = text.replace(regex.REGEX_VARIABLE, function (match, key, ref, val) {
        vars.push(key);
        res += 'var ' + key + ' = ';
        if (ref) {
            var obj = url.parse(ref);
            var resolve;

            // absolute path
            if (obj.protocol) {
                resolve = ref;

            }
            // relative path
            else {
                var dir = path.dirname(file);
                resolve = path.resolve(dir, ref);
            }

            if (val) {
                res += 'merge.merge(' + JSON.stringify(convert(resolve)) + ',' + val + ')';
            } else {
                res += JSON.stringify(convert(resolve));
            }

        } else if (!ref) {
            if (val)
                res += val;
            else
                res += 'null';
        }
        res += ';\n\n';
        return '';
    });

    res += 'module.exports = {';
    res += vars.map(function (vari) {
            return '\t' + vari + ' : ' + vari
        }).join(',') + ',';
    res += '$$text$$ : ' + JSON.stringify(md) + ',';
    res += '$$file$$ : ' + JSON.stringify(file);
    res += '};';

    // console.log("========================\n", res);

    try {
        return eval(res);
    } catch (e) {
        e.res = res;
        e.file = file;
        throw(e)
    }

}

module.exports = convert;
