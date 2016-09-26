var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

var cmacc = require('../src/index');
var convert = cmacc.convert;

describe('Convert', function () {

    describe('Variable', function () {
        describe('Variable.cmacc', function () {
            it('should convert Variable.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Variable.cmacc');
                var result = convert(file);
                // log(result);
                assert.equal(result.hello1, 'World1');
                done()
            });
        });

        describe('Object.cmacc', function () {
            it('should convert Object.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Object.cmacc');
                var result = convert(file);
                log(result);
                assert.equal(result.str, 'Lala');
                assert.equal(result.obj1.hello1, 'Lala');
                done()
            });
        });

        describe('ObjectNested.md', function () {
            it('should convert ObjectNested.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ObjectNested.cmacc');
                var result = convert(file);
                log(result);
                assert.equal(result.str, 'Lala');
                assert.equal(result.obj1.hello1.str, 'Lala');
                done()
            });
        });
    });

    describe.skip('and import', function () {
        it('should convert ImportFile.cmacc', function (done) {
            var file = 'ImportFile.cmacc';
            var shouldBe = 'file:///User/name/test.cmacc';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportHttp.cmacc', function (done) {
            var file = 'ImportHttp.cmacc';
            var shouldBe = 'http://test.nl/test.cmacc';
            importAndConvert(done, file, shouldBe);
        });

        it('should convert ImportRel.cmacc', function (done) {
            var file = 'ImportRel.cmacc';
            var shouldBe = __dirname + '/convert/Test.md';
            importAndConvert(done, file, shouldBe);

        });
    });

    describe('The interpreter', function () {
        it('should invalidate InvalidJson.cmacc because of an unexpected token', function (done) {
            var file = path.join(__dirname, 'convert', 'InvalidJson.cmacc');
            var shouldBe = 'Unexpected token =';
            testInvalidFile(done, file, shouldBe);
        });

        it('should invalidate InvalidString.cmacc because of an illegal token', function (done) {
            var file = path.join(__dirname, 'convert/InvalidString.cmacc');
            var shouldBe = 'Unexpected token ILLEGAL';
            testInvalidFile(done, file, shouldBe);
        });

        it('should invalidate FileNotFound.cmacc because of a file not found', function (done) {
            var file = path.join(__dirname, 'convert/FileNotFound.cmacc');
            var shouldBe = 'ENOENT: no such file or directory, open \'' + file + '\'';
            testInvalidFile(done, file, shouldBe);
        });
    });
});

//helper functions:
function importAndConvert(done, file, shouldBe) {
    file = path.join(__dirname, 'convert', file);
    var result = convert(file);
    log(result);
    assert.equal(result.obj.file, shouldBe);
    assert.equal(result.text, '');
    done();
}

function testInvalidFile(done, file, assertString) {
    try {
        var result = convert(file);
        log(result);
        done()
    } catch (e) {
        console.log(e);
        assert.equal(e.message, assertString);
    }
    done();
}

function log(obj) {
    console.log(JSON.stringify(obj, null, 4));
}