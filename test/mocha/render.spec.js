var assert = require('assert');
var path = require('path');

describe('render', function () {

    var cmacc = require('../../src/cmacc');

    describe('Variable', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(__dirname, '../doc/', 'Variable.md');
            cmacc.parse(file, {}, function (err, json) {
                cmacc.render(file, json, function (err, markdown) {
                    assert.equal(markdown, '# Hello World')
                    done();

                });

            });

        });
    });

    describe('Object', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(__dirname, '../doc/', 'Object.md');
            cmacc.parse(file, {}, function (err, json) {
                cmacc.render(file, json, function (err, markdown) {
                    assert.equal(markdown, '# Hello World')
                    done();

                });

            });

        });
    });

    describe('ImportVariable', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(__dirname, '../doc/', 'ImportVariable.md');
            cmacc.parse(file, {}, function (err, json) {
                cmacc.render(file, json, function (err, markdown) {
                    assert.equal(markdown, '# Hello Hello')
                    done();

                });

            });

        });
    });

    describe('ImportObject', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(__dirname, '../doc/', 'ImportObject.md');
            cmacc.parse(file, {}, function (err, json) {
                cmacc.render(file, json, function (err, markdown) {
                    assert.equal(markdown, '# Hello Hello')
                    done();

                });

            });

        });
    });

    describe('ImportObjectVariable', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(__dirname, '../doc/', 'ImportObjectVariable.md');
            cmacc.parse(file, {}, function (err, json) {
                cmacc.render(file, json, function (err, markdown) {
                    assert.equal(markdown, '# Hello Hello')
                    done();

                });

            });

        });
    });


    describe('ImportObjectNoOverwrite', function () {
        it('should return heading one "Hello World"', function (done) {
            var file = path.join(__dirname, '../doc/', 'ImportObjectNoOverwrite.md');
            cmacc.parse(file, {}, function (err, json) {
                cmacc.render(file, json, function (err, markdown) {
                    assert.equal(markdown, '# Hello World')
                    done();

                });

            });

        });
    });


});