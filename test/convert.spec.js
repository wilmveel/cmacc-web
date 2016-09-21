var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('convert', function () {

    var cmacc = require('../src/index');
    var convert = cmacc.convert;

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

    describe('ImportObject.cmacc', function () {
        it('should convert ImportObject.cmacc', function (done) {
            var file = path.join(__dirname, 'convert', 'ImportObject.cmacc');
            var result = convert(file);
            console.log(JSON.stringify(result, null, 4));
            assert.equal(result.vars.obj2.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/Object.md');
            assert.equal(result.text, '');
            done();
        });
    });

    describe('InvalidJson.cmacc', function () {
        it('should convert InvalidJson.cmacc', function (done) {
            var file = path.join(__dirname, 'convert', 'InvalidJson.cmacc');

            try{
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
            }catch (e){
                assert.equal(e.message, 'SyntaxError: Unexpected token =');
                assert.equal(e.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/InvalidJson.cmacc');
                done();
            }
        });
    });

    describe('InvalidJson.cmacc', function () {
        it('should convert InvalidJson.cmacc', function (done) {
            var file = path.join(__dirname, 'convert', 'InvalidJson.cmacc');

            try{
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
            }catch (e){
                assert.equal(e.message, 'SyntaxError: Unexpected token =');
                assert.equal(e.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/InvalidJson.cmacc');
                done();
            }
        });
    });

    describe('InvalidString.cmacc', function () {
        it('should convert InvalidString.cmacc', function (done) {
            var file = path.join(__dirname, 'convert', 'InvalidString.cmacc');

            try{
                var result = convert(file);
                console.log(JSON.stringify(result, null, 4));
                done()
            }catch (e){
                console.log(e)
                assert.equal(e.message, 'SyntaxError: Unexpected token ILLEGAL');
                assert.equal(e.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/InvalidString.cmacc');
                done();
            }
        });
    });
});