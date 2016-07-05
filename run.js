var fs = require('fs');
var marked = require('marked');

var text = fs.readFileSync('./doc/location.md');

console.log(marked(text.toString()));


fs.writeFileSync('./index.html', marked(text.toString()));
