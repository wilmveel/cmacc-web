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

                assert.equal(ast.variables[0].key, "amount");
                assert.equal(ast.variables[0].val, "$50,000");

                assert.equal(ast.variables[4].ast.variables[0].key, "fullName");
                assert.equal(ast.variables[4].ast.variables[0].val, "Acme Inc.");

                assert.equal(ast.variables[7].ast.variables[4].key, "Company");
                assert.equal(ast.variables[7].ast.variables[4].val, "Willem");

                assert.equal(ast.variables[8].ast.variables[0].ast.variables[4].key, "Company");
                assert.equal(ast.variables[8].ast.variables[0].ast.variables[4].val, "Willem");

                var ycombinator = ast.variables[9].ast;

                assert.equal(ycombinator.variables[0].key, "amount");
                assert.equal(ycombinator.variables[0].val, "$50,000");

                assert.equal(ycombinator.variables[4].ast.variables[0].key, "fullName");
                assert.equal(ycombinator.variables[4].ast.variables[0].val, "Acme Inc.");

                assert.equal(ycombinator.variables[6].ast.variables[4].key, "Company");
                assert.equal(ycombinator.variables[6].ast.variables[4].val, "Willem");

                fs.writeFileSync('index.json', JSON.stringify(ast, null, 4));
                done();
                render(ast, function(err, markdown){
                    fs.writeFileSync('index.html',  marked(markdown))
                    console.log(markdown)

                });
            });
        });
    });

    describe('SAFE_Robinson_v2.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, '../doc/acme/angel-round', 'SAFE_Robinson_v2.md');
            compose(file, null, function (err, ast) {

                assert.equal(ast.variables.valuationCap.val, "\"$1,000,000\"");

                var robinson = ast.variables.robinson.ast
                assert.equal(robinson.variables.amount.val, "\"$1,000,000\"");
                assert.equal(robinson.variables.company.ast.variables.fullName.val, "Acme Inc.");
                assert.equal(robinson.variables.def.ast.variables.Company.val, "Willem");
                assert.equal(robinson.variables.event.ast.variables.def.ast.variables.Company.val, "Willem");

                var ycombinator = robinson.variables.ycombinator.ast
                assert.equal(ycombinator.variables.amount.val, "\"$1,000,000\"");
                assert.equal(ycombinator.variables.company.ast.variables.fullName.val, "Acme Inc.");
                assert.equal(ycombinator.variables.def.ast.variables.Company.val, "Willem");
                assert.equal(ycombinator.variables.event.ast.variables.def.ast.variables.Company.val, "Willem");

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