var fs = require('fs');
var path = require('path');
var async = require('async');

var root = path.join(__dirname, '../Cmacc-Org/Doc');

var cash = {};

var i = 0

function parse(file) {

    var node = {};

    var text = fs.readFileSync(file, 'utf8');

    REGEX_LINE = /^(.*)=(.*)$/gm;
    REGEX_ENTRY = /^(.*)=(.*)$/;
    REGEX_IMPORT = /^\[(.*)\]$/;

    var node = {};

    text.toString().match(REGEX_LINE).forEach(function (line) {
            var entry = line.match(REGEX_ENTRY)

            var key = entry[1];
            var value = entry[2];


            var imp = value.match(REGEX_IMPORT)

            if (key) {
                //console.log(key, value)
                if (imp) {
                    if (cash[imp[1]]) {
                        node[key] = cash[key];
                    } else {
                        cash[imp[1]] = 1;
                        value = parse(path.join(root, imp[1]));
                        node[key] = value

                    }


                } else {
                    node [key] = value
                }
            }


        });
    return node;

}

var doc = parse(path.join(root, 'Dx/Acme/01-AngelRound/01-SAFE-Robinson_v0.md'))

console.log(doc);

