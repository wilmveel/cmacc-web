var path = require('path');
var convert = require('./convert');

function parse(js) {

    if (js.file) {
        var file = path.join(js.file);
        var next = parse(convert(file));
        js.file = next;
        if (!js.vars) {
            js.vars = next.vars;
        } else {
            var nextKeys = Object.keys(next.vars);
            nextKeys.forEach(function (key) {
                if (js.vars[key]) {
                }
                else {
                    js.vars[key] = parse(next.vars[key]);
                }
            });
        }
        js.text = next.text;
        js.type = next.type;
        delete js.file;
    } else if (js.vars) {
        var vars = Object.keys(js.vars);
        vars.forEach(function(key) {
            js.vars[key] = js.vars[key] ? parse(js.vars[key]) : null;
        });
    } else if (typeof js.text === 'object') {
        js.text = parse(js.text);
    }

    return js;

}

module.exports = parse;
