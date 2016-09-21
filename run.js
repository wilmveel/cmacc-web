var fs = require('fs');
var md = require('marked');
var path = require('path');

var index = require('./src/index');

var convert = index.convert;
var parse = index.parse;
var resolve = index.resolve;

var input = process.argv[2] || './test/doc/HelloWorld.cmacc';

var file = convert(path.join(__dirname, input));

var ast = parse(file);

var resolved = resolve(ast);

var rendered = md(resolved);

output(rendered);

function output(result) {
    // console.log('result: \n', result);
    console.log('args: ', process.argv);
    fs.writeFileSync('./index.html', result);
}
