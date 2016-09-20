var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('convert', function () {

    var convert = require('../src/js/convert');

    describe('Object.md', function () {

        it('should convert Object.cmacc', function (done) {
            var file = path.join(__dirname, 'convert', 'Object.cmacc');
            var result = convert(file);
            console.log(JSON.stringify(result, null, 4));

            assert.equal(result.vars.str, 'Lala');
            assert.equal(result.vars.obj1.hello1, 'Lala');
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
            }catch (e){
                assert.equal(e.message, 'SyntaxError: Unexpected token =');
                assert.equal(e.file, '/Users/willemveelenturf/projects/commonaccord/common-accourd-js/test/convert/InvalidJson.cmacc');
                done();
            }



        });
    });


});