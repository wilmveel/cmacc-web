var fs = require('fs');
var md = require('marked');
var path = require('path');

var convert = require('./src/js/convert');
var parse = require('./src/js/parse');
var resolve = require('./src/js/resolve');

var input = process.argv[2] || '/doc/test.md';
var file = convert(path.join(__dirname, input));

var ast = parse(file);

var resolved = resolve(ast);

var rendered = md(resolved);

output(rendered);

function output(result) {
    // console.log('result: \n', result);
    console.log('args: ', process.argv);
    fs.writeFileSync('indexjs.html', result);
}
