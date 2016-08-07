var fs = require('fs');
var md = require('./bower_components/marked/marked.min');
var path = require('path');

var parse = require('./src/js/parse');
var resolve = require('./src/js/resolve');
var render = require('./src/js/render');

var input = process.argv[2] || '/doc/js/test.js';
var file = require(path.join(__dirname, input));

var ast = parse(file);

var result = resolve(ast);

output(render(result));

function output(result) {
    result = md(result);
    console.log('result: \n', result);
    fs.writeFileSync('indexjs.html', result);
}
