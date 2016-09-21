var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('convert', function () {

    var cmacc = require('../src/index');
    var convert = cmacc.convert;

    describe('Variable', function () {
        describe('Variable.cmacc', function () {
            it('should convert Variable.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Variable.cmacc');
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.hello1, 'World1');
                done()
            });
        });

        describe('Object.cmacc', function () {
            it('should convert Object.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'Object.cmacc');
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.str, 'Lala');
                assert.equal(result.vars.obj1.hello1, 'Lala');
                done()
            });
        });

        describe('ObjectNested.md', function () {
            it('should convert ObjectNested.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ObjectNested.cmacc');
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.str, 'Lala');
                assert.equal(result.vars.obj1.hello1.str, 'Lala');
                done()
            });
        });
    });

    describe('Import', function () {


        describe('ImportFile.cmacc', function () {
            it('should convert ImportFile.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ImportFile.cmacc');
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj.file, 'file:///User/name/test.cmacc');
                assert.equal(result.text, '');
                done();
            });
        });

        describe('ImportHttp.cmacc', function () {
            it('should convert ImportHttp.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ImportHttp.cmacc');
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj.file, 'http://test.nl/test.cmacc');
                assert.equal(result.text, '');
                done();
            });
        });

        describe('ImportRel.cmacc', function () {
            it('should convert ImportRel.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'ImportRel.cmacc');
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/Test.md');
                assert.equal(result.text, '');
                done();
            });
        });
    });

    describe('Invalid', function () {

        describe('InvalidJson.cmacc', function () {
            it('should convert InvalidJson.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'InvalidJson.cmacc');

                try {
                    var result = convert(file);
                    console.log(JSON.stringify(result, null, 4));
                } catch (e) {
                    assert.equal(e.message, 'SyntaxError: Unexpected token =');
                    assert.equal(e.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/InvalidJson.cmacc');
                    done();
                }
            });
        });

        describe('InvalidJson.cmacc', function () {
            it('should convert InvalidJson.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'InvalidJson.cmacc');

                try {
                    var result = convert(file);
                    console.log(JSON.stringify(result, null, 4));
                } catch (e) {
                    assert.equal(e.message, 'SyntaxError: Unexpected token =');
                    assert.equal(e.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/InvalidJson.cmacc');
                    done();
                }
            });
        });

        describe('InvalidString.cmacc', function () {
            it('should convert InvalidString.cmacc', function (done) {
                var file = path.join(__dirname, 'convert', 'InvalidString.cmacc');

                try {
                    var result = convert(file);
                    console.log(JSON.stringify(result, null, 4));
                    done()
                } catch (e) {
                    console.log(e)
                    assert.equal(e.message, 'SyntaxError: Unexpected token ILLEGAL');
                    assert.equal(e.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/InvalidString.cmacc');
                    done();
                }
            });
        });
    });
});