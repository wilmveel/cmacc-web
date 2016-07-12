var assert = require('assert');
var path = require('path');
var fs = require('fs');

var marked = require('marked');

var cmacc = require('./src/cmacc');

var input = process.argv[2];
var output = process.argv[3] || 'index.html';

var file = path.join(__dirname, input);

cmacc.parse(file, null, function (err, data, text) {
    if(err) return console.error(err);


        console.log(data)


});
