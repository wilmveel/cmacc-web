var assert = require('assert');
var path = require('path');
var fs = require('fs');

var marked = require('marked');

var cmacc = require('./src/cmacc');


var file = path.join(__dirname, 'doc', 'acme/angel-round/safe-robinson.md');

cmacc.parse(file, {}, function (err, json) {
    if(err) throw err;
    cmacc.render(file, json, function (err, markdown) {
        console.log(markdown)
        var style = '<style>.definedterm {color:red}</style>'
        fs.writeFile('index.html', style + marked(markdown))
    });

});
