var assert = require('assert');
var path = require('path');
var fs = require('fs');

var marked = require('marked');

var cmacc = require('./src/cmacc');

var input = process.argv[2];
var output = process.argv[3] || 'index.html';

var file = path.join(__dirname, input);

cmacc.parse(file, {}, function (err, json) {
    if(err) throw err;
    cmacc.render(file, json, function (err, markdown) {

        var style = '<style>.definedterm {color:yellow}</style>'

        if(!fs.existsSync(path.join(__dirname, 'build')))
            fs.mkdirSync(path.join(__dirname, 'build'));

        fs.writeFileSync(path.join(__dirname, 'build', output), style + marked(markdown))

        console.log(markdown)

    });
});
