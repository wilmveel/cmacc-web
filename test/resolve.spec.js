var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('parse', function () {

    var cmacc = require('../src/index');

    var convert = cmacc.convert;
    var resolve = cmacc.resolve;

    var run = function (file) {
        var ast = convert(file);
        var result = resolve(ast);
        return result;
    };


    describe('HelloWorld.cmacc', function () {
        it('should parse HelloWorld.cmacc', function (done) {
            var file = path.join(__dirname, 'resolve', 'HelloWorld.cmacc');
            var result = run(file);

            assert.equal(result, "Hello World");

            done()
        });
    });

    describe('SubInVar.cmacc', function () {
        it('should parse SubInVar.cmacc', function (done) {
            var file = path.join(__dirname, 'resolve', 'SubInVar.cmacc');
            var result = run(file);

            assert.equal(result, "Hello World");

            done()
        });
    });

    describe('SubInObj.cmacc', function () {
        it('should parse SubInObj.cmacc', function (done) {
            var file = path.join(__dirname, 'resolve', 'SubInObj.cmacc');
            var result = run(file);

            assert.equal(result, "Hello World");

            done()
        });
    });

    describe('Object.cmacc', function () {
        it('should parse Object.cmacc', function (done) {
            var file = path.join(__dirname, 'resolve', 'Object.cmacc');
            var result = run(file);

            assert.equal(result, "Hello World");

            done()
        });
    });

    describe('Import.cmacc', function () {
        it('should parse Import.cmacc', function (done) {
            var file = path.join(__dirname, 'resolve', 'Import.cmacc');
            var result = run(file);

            assert.equal(result, "Hello World\n\nText");

            done()
        });
    });


});