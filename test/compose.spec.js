var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('compose', function () {

    var compose = require('../src/compose');
    var render = require('../src/render');

    describe('ImportObjectOverwrite.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, 'parser', 'ImportObjectSubstitutionObject.md');
            compose(file, null, function (err, doc) {
                console.log(JSON.stringify(doc, null, 4));
                done();
            });
        });
    });

    describe('ImportObjectSubstitutionImport.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, 'parser', 'ImportObjectSubstitutionImport.md');
            compose(file, null, function (err, doc) {
                console.log(JSON.stringify(doc, null, 4));
                done();
            });
        });
    });

    describe('SAFE_Robinson.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, '../doc/acme/angel-round', 'SAFE_Robinson.md');
            compose(file, null, function (err, ast) {
                render(ast, function(err, markdown){
                    fs.writeFileSync('index.html',  marked(markdown))
                    console.log(markdown)
                    done();
                });
            });
        });
    });

});