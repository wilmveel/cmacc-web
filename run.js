var assert = require('assert');
var path = require('path');
var fs = require('fs');

var marked = require('marked');

var cmacc = require('./src/cmacc');


var file = path.join(__dirname, process.argv[2]);

cmacc.parse(file, {}, function (err, json) {
    if(err) throw err;
    cmacc.render(file, json, function (err, markdown) {
        console.log(markdown)
        var style = '<style>.definedterm {color:yellow}</style>'

        var stats = fs.lstatSync('./build');

        if(!stats.isDirectory())
            fs.mkdirSync('./build');

        fs.writeFileSync('./build/index.html', style + marked(markdown))
    });
});
