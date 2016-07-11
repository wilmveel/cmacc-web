var fs = require('fs');
var path = require('path');
var async = require('async');

var mkpath = require('mkpath');

var root = path.join(__dirname, '../Cmacc-Org/Doc');

var cash = {};

var i = 0

function parse(file, callback) {

    var node = {};

    fs.readFile(path.join(root, file), function (err, text) {

        if (err) return callback(err);

        REGEX_LINE = /^(.*)=(.*)$/gm;
        REGEX_ENTRY = /^(.*)=(.*)$/;
        REGEX_IMPORT = /^\[(.*)\]$/;

        var exec = {};

        text.toString().match(REGEX_LINE).forEach(function (line) {
            var entry = line.match(REGEX_ENTRY)

            var key = entry[1];
            var value = entry[2];

            var imp = value.match(REGEX_IMPORT)

            if (cash[file]) {
                exec[key] = function (cb) {
                    cb(null, value)
                }
            }
            else if (imp) {
                //cash[file] = {};
                exec[key] = function (cb) {
                    parse(imp[1], cb)
                };

            }
            else {
                exec[key] = function (cb) {
                    cb(null, value)
                }
            }
        });

        async.parallel(exec, function (err, res) {
            //cash[file] = res;
            mkpath(path.dirname(path.join(__dirname, 'lib', file)), function (err) {
                if (err) throw err;
                fs.writeFile(path.join(__dirname, 'lib', file), text, function (err) {
                    //console.log(err)
                    callback(null, res)
                });
            });

        });


    })
}

parse('Dx/Acme/01-AngelRound/01-SAFE-Robinson_v0.md', function (err, doc) {


    console.log(JSON.stringify(doc, null, 4));


});