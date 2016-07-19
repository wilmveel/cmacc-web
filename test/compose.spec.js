var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('compose', function () {

    var compose = require('../src/compose');
    var render = require('../src/render');

    describe('Variable.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, 'parser', 'Variable.md');
            compose(file, null, function (err, doc) {
                console.log(JSON.stringify(doc, null, 4));
                done();
            });
        });
    });

    describe('ImportObjectOverwrite.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, 'parser', 'ImportObjectOverwrite.md');
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

                assert.equal(ast.variables.amount.val, "\"$50,000\"");
                assert.equal(ast.variables.company.ast.variables.fullName.val, "Acme Inc.");

                assert.equal(ast.variables.def.ast.variables.Company.val, "Willem");

                fs.writeFileSync('index.json', JSON.stringify(ast, null, 4));
                done();
                render(ast, function(err, markdown){
                    fs.writeFileSync('index.html',  marked(markdown))
                    console.log(markdown)

                });
            });
        });
    });

});