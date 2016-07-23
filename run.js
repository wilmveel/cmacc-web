var assert = require('assert');
var path = require('path');
var fs = require('fs');

var marked = require('marked');

var cmacc = require('./src/cmacc');

var input = process.argv[2];

var file = path.join(__dirname, input);


cmacc.compose(file, null, function (err, ast) {

    fs.writeFileSync('run.json', JSON.stringify(ast, null, 4))

    cmacc.render(ast, function (err, markdown) {

        var html = marked(markdown)

        console.log("---MARKDOWN---\n");
        console.log(markdown + "\n");

        console.log("---HTML---\n");
        console.log(html);

        fs.writeFileSync('run.md', markdown)
        fs.writeFileSync('run.html', html)
    });
});
