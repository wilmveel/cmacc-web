var assert = require('assert');

var fs = require('fs');
var path = require('path');

describe('regex', function () {

    var regex = require('../src/regex');

    var root = path.join(__dirname, 'regex');

    var check = function(text, callback){
        var match;

        match = regex.REGEX_VARIABLE.exec(text)
        assert.equal(match[1], 'hello');
        assert.equal(match[2], undefined);
        assert.equal(match[3], undefined);

        match = regex.REGEX_VARIABLE.exec(text)
        assert.equal(match[1], 'hello');
        assert.equal(match[2], undefined);
        assert.equal(match[3], 'null');

        match = regex.REGEX_VARIABLE.exec(text)
        assert.equal(match[1], 'hello');
        assert.equal(match[2], undefined);
        assert.equal(match[3], '"World"');

        match = regex.REGEX_VARIABLE.exec(text);
        assert.equal(match[1], 'obj');
        assert.equal(match[2], undefined);
        assert.deepEqual(JSON.parse(match[3]), { hello: 'World' });

        match = regex.REGEX_VARIABLE.exec(text);
        assert.equal(match[1], 'imp');
        assert.equal(match[2], './doc.md');
        assert.equal(match[3], undefined);

        match = regex.REGEX_VARIABLE.exec(text);
        assert.equal(match[1], 'imp_over');
        assert.equal(match[2], './doc.md');
        assert.deepEqual(JSON.parse(match[3]), { hello: 'World' });

        match = regex.REGEX_VARIABLE.exec(text);
        assert.equal(match[1], 'imp_over_obj');
        assert.equal(match[2], './doc.md');
        assert.deepEqual(JSON.parse(match[3]), { hello: { hello: 'World' } });

        callback()
    }

    describe('RegexVariable.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(root, 'RegexVariable.md');
            fs.readFile(file, function (err, text) {
                console.log(text);
                regex.REGEX_VARIABLE.lastIndex = 0;
                check(text, done)
            });
        });
    });

    describe('RegexVariableNoEnter.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(root, 'RegexVariableNoEnter.md');
            fs.readFile(file, function (err, text) {
                console.log("text", text);
                regex.REGEX_VARIABLE.lastIndex = 0;
                check(text, done)
            });
        });
    });

    describe('RegexVariableNoSpace.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(root, 'RegexVariableNoSpace.md');
            fs.readFile(file, function (err, text) {
                console.log("text", text);
                regex.REGEX_VARIABLE.lastIndex = 0;
                check(text, done)
            });
        });
    });

    describe('RegexVariableOneLine.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(root, 'RegexVariableOneLine.md');
            fs.readFile(file, function (err, text) {
                console.log("text", text);
                regex.REGEX_VARIABLE.lastIndex = 0;
                check(text, done)
            });
        });
    });

    describe('RegexKeyValue.md', function () {
        it('should parse variable hello World', function (done) {
            var file = path.join(root, 'RegexKeyValue.md');
            fs.readFile(file, 'utf8', function (err, text) {
                console.log("text", text);

                var match;

                match = regex.REGEX_KEYVALUE.exec(text)
                console.log("match", match);
                assert.equal(match[1], '"hello"');
                assert.equal(match[2], 'world');

                match = regex.REGEX_KEYVALUE.exec(text)
                console.log("match", match);
                assert.equal(match[1], '"hello"');
                assert.equal(match[2], '"World"');

                done()
            });
        });
    });

});