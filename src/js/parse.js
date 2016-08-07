var path = require('path');

function parse(js) {
    var keys = Object.keys(js);
    keys.forEach(function (each) {
        if (each === 'file') {
            var file = path.join(__dirname, js.file);
            var next = parse(require(file));
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
        } else if (typeof js[each].text === 'object') {
            js[each].text = parse(js[each].text);
        } else if (typeof js[each].text) {

        } else {
            js[each] = parse(js[each]);
        }
    });

    return js;

}

module.exports = parse;