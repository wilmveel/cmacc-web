var fs = require('fs');
var path = require('path');

var regex = require('../regex');

function convert(file) {
    var res = '';

    var text = fs.readFileSync(file, 'utf8');

    var md = text.replace(regex.REGEX_VARIABLE, function (match, key, ref, val) {
        res += 'var ' + key + ' = ' + '\n';
        if (ref) {
            res += '{\tfile : "' + ref + '",\n';
            if (val) res += '\tvars : ' + val + '}\n';
            else if (!val) res += '}';
        } else if (!ref) {
            if (val) res+= val + '\n';
        }
        res += ';\n\n';
        return '';
    });

    md = md.replace(/[^\n]+/g, function(match) {
        match = match.slice(4);
        match = '{text: "' + match + '"}, ';
        return match;
    });

    res += 'module.exports = [' + md.replace(/\n+/g, '') + '];';
    res = res.replace(/,\s]/g, ']');

    res = res.replace(/"{0,1}{{2}[\w.]+}{2}"{0,1}/g, extractVar);

    function extractVar(match) {
        var start = match[0];
        var end = match[match.length - 1];
        if (start === end && start === '"') {
            match = match.slice(3, -3);
            return match;
        } else if (start === '{' && end === '}') {
            match = match.slice(2, -2);
            return '" + ' + match + ' + "'
        } else if (start === '"' && end === '}') {
            match = match.slice(3, -2);
            return match + ' + "';
        } else if (start === '{' && end === '"') {
            match = match.slice(2, -3);
            return '" + ' + match;
        }
    }

    return eval(res);
}

module.exports = convert;
