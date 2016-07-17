var assert = require('assert');
var path = require('path');
var fs = require('fs');

var marked = require('marked');

var cmacc = require('./src/cmacc');

var input = process.argv[2];
var output = process.argv[3] || 'build/SAFE_Robinson.html';

var file = path.join(__dirname, input);


cmacc.compose(file, null, function (err, ast) {

    fs.writeFileSync('index.json', JSON.stringify(ast, null, 4))

    cmacc.render(ast, function (err, text) {
        console.log(text)

        fs.writeFileSync('index.md', text)

        var header = fs.readFileSync('header.html');
        fs.writeFileSync('index.html', header + marked(text))
    });
});
