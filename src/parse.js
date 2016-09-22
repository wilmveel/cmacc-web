var path = require('path');
var convert = require('./convert');
var merge = require('./merge').merge;

function parse(js) {

    if (js.file) {
        var file = path.join(js.file);
        var next = parse(convert(file));
        js.file = next;

        if (js.vars) {
            js.vars = merge(parse(next.vars), js.vars);
        }else{
            js.vars = next.vars;
        }


        js.text = next.text;
        js.type = next.type;
        delete js.file;
    } else if (js.vars) {
        var vars = Object.keys(js.vars);
        vars.forEach(function (key) {
            js.vars[key] = js.vars[key] ? parse(js.vars[key]) : null;
        });
    } else if (typeof js.text === 'object') {
        js.text = parse(js.text);
    }

    return js;

}

module.exports = parse;