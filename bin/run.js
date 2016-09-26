#! /usr/bin/env node

var fs = require('fs');
var md = require('marked');
var path = require('path');

var index = require('../src/index');

var convert = index.convert;
var resolve = index.resolve;

var input = process.argv[2] || './index.cmacc';
var output = process.argv[3] || path.basename(input, path.extname(input));

try{
    var ast = convert(path.resolve(process.cwd(), input));
    fs.writeFileSync(path.resolve(process.cwd(), output+ '.json'), JSON.stringify(ast, null, 4));
    var resolved = resolve(ast);
    var rendered = md(resolved);
}catch (e){
    console.error(e.message);
    console.error(e.file);
}

fs.writeFileSync(path.resolve(process.cwd(), output+ '.html'), rendered);