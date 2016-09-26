var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('parse', function () {

    var cmacc = require('../src/index');
    var convert = cmacc.convert;

    describe('Variable', function () {

        describe('VariableEmpty.cmacc', function () {
            it('should parse VariableEmpty.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableEmpty.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.hello1, null);

                done()
            });
        });

        describe('VariableNull.cmacc', function () {
            it('should parse VariableNull.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableNull.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.hello1, null);

                done()
            });
        });

        describe('VariableString.cmacc', function () {
            it('should parse VariableString.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableString.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.hello1, 'World1');

                done()
            });
        });

        describe('VariableObject.cmacc', function () {
            it('should parse VariableObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'VariableObject.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.hello1.hello1, 'World1');

                done()
            });
        });

    });

    describe('Import', function () {

        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj2.hello1.hello1, 'World1');
                done()
            });
        });

        describe('ImportObjectOverwrite.cmacc', function () {
            it('should parse ImportObjectOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectOverwrite.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj2.obj1.hello1, 'World2');
                assert.equal(result.obj2.hello1.hello1, 'World1');
                done()
            });
        });

        describe('ImportObjectSubstitutionImport.cmacc', function () {
            it('should parse ImportObjectSubstitutionImport.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImport.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));

                assert.equal(result.obj3.obj1.hello1, 'World3');
                assert.equal(result.obj3.hello1.hello1, 'World1');

                assert.equal(result.obj2.hello1.obj1.hello1, 'World3');
                assert.equal(result.obj2.hello1.hello1.hello1, 'World1');

                done()
            });
        });

        describe('ImportObjectSubstitutionImportDouble.cmacc', function () {
            it('should parse ImportObjectSubstitutionImportDouble.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObjectSubstitutionImportDouble.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));

                assert.equal(result.obj3.obj2.obj1.hello1, 'World3');

                assert.equal(result.obj3.obj3.obj1.hello1, 'World3');
                assert.equal(result.obj3.obj3.hello1.hello1, 'World1');

                done()
            });
        });
    });

    describe('Change', function () {
        describe('ImportObject.cmacc', function () {
            it('should parse ImportObject.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'ImportObject.cmacc');

                var result = convert(file);

                result.obj2.hello1 = 'World5';
                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj2.hello1, 'World5');

                done()
            });
        });
    });

    describe('Merge', function () {

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj.hello2, 'World1');
                assert.equal(result.obj.hello1.hello1, 'World1');
                done()
            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj.hello1.hello2, 'World2');
                done()
            });
        });

        describe('MergeOverwrite.cmacc', function () {
            it('should parse MergeOverwrite.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeOverwrite.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj.hello1.hello1, 'World2');
                done()
            });
        });
    });

    describe('Merge', function () {

        describe('MergeSimple.cmacc', function () {
            it('should parse MergeSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeSimple.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj.hello2, 'World1');
                assert.equal(result.obj.hello1.hello1, 'World1');
                done()
            });
        });

        describe('MergeDepth.cmacc', function () {
            it('should parse MergeDepth.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'MergeDepth.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.obj.hello1.hello2, 'World2');
                done()
            });
        });

    });

    describe('Text', function () {
        describe('TextSimple.cmacc', function () {
            it('should parse TextSimple.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'TextSimple.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.test, 'Hello');
                assert.equal(result.$$text$$, '{{test}} World');
                done()
            });
        });

        describe('TextImport.cmacc', function () {
            it('should parse TextImport.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'TextImport.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));

                assert.equal(result.test.test, 'Hello');
                assert.equal(result.test.$$text$$, '{{test}} World');
                assert.equal(result.$$text$$, '{{test}}');
                done()
            });
        });
    });

    describe('Deep', function () {
        describe('DeeperVars.cmacc', function () {
            it('should parse DeeperVars.cmacc', function (done) {
                var file = path.join(__dirname, 'parse', 'DeeperVars.cmacc');

                var result = convert(file);

                console.log(JSON.stringify(result, null, 4));
                assert.equal(result.test.test, 'World1');
                assert.equal(result.obj.hello1.hello1, 'World1');
                done()
            });
        });

    });

});