#! /usr/bin/env node

var fs = require('fs');
var md = require('marked');
var path = require('path');

var index = require('../src/index');

var convert = index.convert;
var parse = index.parse;
var resolve = index.resolve;

var input = process.argv[2] || './index.cmacc';
var output = process.argv[3] || path.basename(input, path.extname(input)) + '.html'

var file = convert(path.resolve(process.cwd(), input));

try{
    var ast = parse(file);
    console.log(ast)
    var resolved = resolve(ast);
    var rendered = md(resolved);
}catch (e){
    console.error(e)
}


fs.writeFileSync(path.resolve(process.cwd(), output), rendered);