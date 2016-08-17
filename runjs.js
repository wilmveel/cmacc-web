var fs = require('fs');
var md = require('./bower_components/marked/marked.min');
var path = require('path');

var convert = require('./src/js/convert');
var parse = require('./src/js/parse');
var resolve = require('./src/js/resolve');
var render = require('./src/js/render');

// var input = process.argv[2] || '/doc/js/test.js';
var input = process.argv[2] || '/doc/test.md';
var file = convert(path.join(__dirname, input));

// var ast = parse(file);

// var resolved = resolve(ast);

// var rendered = render(resolved);

output(file);

function output(result) {
    // result = md(result);
    console.log('result: \n', result);
    // fs.writeFileSync('indexjs.html', result);
}
