#! /usr/bin/env node

var fs = require('fs');
var md = require('marked');
var path = require('path');

var index = require('../src/index');

var convert = index.convert;
var parse = index.parse;
var resolve = index.resolve;

var input = process.argv[2] || './index.cmacc';
var output = process.argv[3] || './index.html';

var file = convert(path.join(__dirname, input));

var ast = parse(file);
var resolved = resolve(ast);
var rendered = md(resolved);

console.log('args: ', process.argv);
fs.writeFileSync(output, rendered);

