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

                assert.equal(ast.variables[4].variables[0].key, "fullName");
                assert.equal(ast.variables[4].variables[0].val, "Acme Inc.");

                assert.equal(ast.variables[7].variables[4].key, "Company");
                assert.equal(ast.variables[7].variables[4].val, "Willem");

                assert.equal(ast.variables[8].variables[0].variables[4].key, "Company");
                assert.equal(ast.variables[8].variables[0].variables[4].val, "Willem");

                var ycombinator = ast.variables[9];

                assert.equal(ycombinator.variables[0].key, "amount");
                assert.equal(ycombinator.variables[0].val, "$50,000");

                assert.equal(ycombinator.variables[4].variables[0].key, "fullName");
                assert.equal(ycombinator.variables[4].variables[0].val, "Acme Inc.");

                assert.equal(ycombinator.variables[6].variables[4].key, "Company");
                assert.equal(ycombinator.variables[6].variables[4].val, "Willem");

                fs.writeFileSync('index.json', JSON.stringify(ast, null, 4));

                render(ast, function (err, markdown) {
                    console.log(markdown)
                    done();
                });
            });
        });
    });

    describe('SAFE_Robinson_v2.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(__dirname, '../doc/acme/angel-round', 'SAFE_Robinson_v2.md');
            compose(file, null, function (err, ast) {

                assert.equal(ast.variables[0].key, "valuationCap");
                assert.equal(ast.variables[0].val, "$1,000,000");

                var robinson = ast.variables[2]
                assert.equal(robinson.variables[2].key, "valuationCap");
                assert.equal(robinson.variables[2].val, "$1,000,000");

                assert.equal(robinson.variables[4].variables[0].key, "fullName");
                assert.equal(robinson.variables[4].variables[0].val, "Acme Inc.");

                assert.equal(robinson.variables[7].variables[4].key, "Company");
                assert.equal(robinson.variables[7].variables[4].val, "James");

                assert.equal(robinson.variables[8].variables[0].variables[4].key, "Company");
                assert.equal(robinson.variables[8].variables[0].variables[4].val, "James");

                var ycombinator = robinson.variables[9];

                assert.equal(ycombinator.variables[3].key, "valuationCap");
                assert.equal(ycombinator.variables[3].val, "$1,000,000");

                assert.equal(ycombinator.variables[4].variables[0].key, "fullName");
                assert.equal(ycombinator.variables[4].variables[0].val, "Acme Inc.");

                assert.equal(ycombinator.variables[6].variables[4].key, "Company");
                assert.equal(ycombinator.variables[6].variables[4].val, "James");

                fs.writeFileSync('index.json', JSON.stringify(ast, null, 4));

                render(ast, function (err, markdown) {
                    console.log(markdown)
                    done();
                });
            });
        });
    });

    describe('http SAFE_Robinson.md', function () {
        it('should parse variable hello World', function (done) {
            var file = 'http://localhost:3000/doc/acme/angel-round/SAFE_Robinson.md';
            compose(file, null, function (err, ast) {

                render(ast, function (err, markdown) {
                    console.log(markdown)
                    done();
                });
            });
        });
    });

});