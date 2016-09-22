var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('parse', function () {

    var cmacc = require('../src/index');
    var convert = cmacc.convert;
    var parse = cmacc.parse;

    describe('Variable', function () {

        describe('VariableEmpty.cmacc', function () {
            it('should parse VariableEmpty.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableEmpty.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.hello1, null);

                done()
            });
        });

        describe('VariableNull.cmacc', function () {
            it('should parse VariableNull.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableNull.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.hello1, null);

                done()
            });
        });

        describe('VariableString.cmacc', function () {
            it('should parse VariableString.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableString.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.hello1, 'World1');

                done()
            });
        });

        describe('VariableObject.cmacc', function () {
            it('should parse VariableObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableObject.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.hello1.hello1, 'World1');

                done()
            });
        });

    });

    describe('Import', function () {

        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj2.vars.hello1.hello1, 'World1');
                done()
            });
        });

        describe('ImportObjectOverwrite.cmacc', function () {
            it('should parse ImportObjectOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectOverwrite.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj2.vars.obj1.hello1, 'World2');
                assert.equal(result.vars.obj2.vars.hello1.hello1, 'World1');
                done()
            });
        });

        describe('ImportObjectSubstitutionImport.cmacc', function () {
            it('should parse ImportObjectSubstitutionImport.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));

                assert.equal(result.vars.obj3.vars.obj1.hello1, 'World3');
                assert.equal(result.vars.obj3.vars.hello1.hello1, 'World1');

                assert.equal(result.vars.obj2.vars.hello1.vars.obj1.hello1, 'World3');
                assert.equal(result.vars.obj2.vars.hello1.vars.hello1.hello1, 'World1');

                done()
            });
        });

        describe('ImportObjectSubstitutionImportDouble.cmacc', function () {
            it('should parse ImportObjectSubstitutionImportDouble.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImportDouble.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));

                assert.equal(result.vars.obj3.vars.obj2.obj1.hello1, 'World3');

                assert.equal(result.vars.obj3.vars.obj3.vars.obj1.hello1, 'World3');
                assert.equal(result.vars.obj3.vars.obj3.vars.hello1.hello1, 'World1');

                done()
            });
        });
    });

    describe('Change', function () {
        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var js = convert(file);
                var result = parse(js);

                result.vars.obj2.vars.hello1 = 'World5';
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj2.vars.hello1, 'World5');

                done()
            });
        });
    });

    describe('Merge', function () {

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj.vars.hello2, 'World1');
                assert.equal(result.vars.obj.vars.hello1.hello1, 'World1');
                done()
            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj.vars.hello1.hello2, 'World2');
                done()
            });
        });

        describe('MergeOverwrite.cmacc', function () {
            it('should parse MergeOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeOverwrite.cmacc');

                var js = convert(file);
                var result = parse(js);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.vars.obj.vars.hello1.hello1, 'World2');
                done()
            });
        });
    });

});