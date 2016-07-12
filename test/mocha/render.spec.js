var assert = require('assert');
var path = require('path');

describe('parse', function () {

    var cmacc = require('../../src/cmacc');

    var root = path.join(__dirname, '../doc/');

    describe('Variable.md', function () {
        it('should return variable hello World', function (done) {
            var file = path.join(root, 'Variable.md');
            cmacc.parse(file, {}, function (err, json) {
                assert.equal(json.hello, 'World');
                done();
            });
        });
    });

    describe('Object.md', function () {
        it('should return object hello world', function (done) {
            var file = path.join(root, 'Object.md');
            cmacc.parse(file, {}, function (err, json) {
                assert.equal(json.obj.hello, 'World');
                done();
            });
        });
    });

    describe('ImportVariable.md', function () {
        it('should return object and overwrite', function (done) {
            var file = path.join(root, 'ImportVariable.md');
            cmacc.parse(file, {}, function (err, json) {
                console.log(json)
                assert.equal(json.obj.hello, 'World');
                done();
            });
        });
    });

    describe('ImportObject.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObject.md');
            cmacc.parse(file, {}, function (err, json) {
                assert.equal(json.obj.obj.hello, 'World');
                done();
            });
        });
    });

    describe('ImportVariableOverwrite.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportVariableOverwrite.md');
            cmacc.parse(file, {}, function (err, json) {
                assert.equal(json.obj.hello, 'Hello');
                done();
            });
        });
    });

    describe('ImportObjectOverwrite.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectOverwrite.md');
            cmacc.parse(file, {}, function (err, json) {
                assert.equal(json.obj.obj.hello, 'Hello');
                done();
            });
        });
    });

    describe('ImportObjectSubstitutionVariable.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectSubstitutionVariable.md');
            cmacc.parse(file, {}, function (err, json) {
                assert.equal(json.obj.hello, 'Hello');
                done();
            });
        });
    });

    describe('ImportObjectSubstitutionObject.md', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(root, 'ImportObjectSubstitutionObject.md');
            cmacc.parse(file, {}, function (err, json) {
                assert.equal(json.obj.hello, 'Hello');
                done();
            });
        });
    });

});