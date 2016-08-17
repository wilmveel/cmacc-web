var path = require('path');
var convert = require('./convert');

function parse(js) {
    if (js.length > 0) {
        for (var i = 0; i < js.length; i++) {
            js[i] = parse(js[i]);
        }
    } else {
        return parseObj(js);
    }
    return js;
}

function parseObj(js) {
    console.log(js);
    if (js.file) {
        var file = path.join(__dirname, js.file);
        var next = parse(convert(file));
        js.file = next;
        if (!js.vars) {
            js.vars = next.vars;
        } else {
            var nextKeys = Object.keys(next.vars);
            nextKeys.forEach(function(key) {
                if (js.vars[key]) {}
                else {
                    js.vars[key] = next.vars[key];
                }
            });
        }
        js.text = next.text;
        js.type = next.type;
        delete js.file;
    } else if (typeof js.text === 'object') {
        js.text = parse(js.text);
    }

    return js;

}

module.exports = parse;
