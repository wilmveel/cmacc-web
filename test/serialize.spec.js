var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('serialize', function () {

    var compose = require('../src/compose');
    var serialize = require('../src/serialize');

    describe('Variable.md', function () {
        it('should parse and serialize', function (done) {
            var file = path.join(__dirname, 'parser', 'Variable.md');
            compose(file, null, function (err, ast) {

                assert.equal(ast.variables[0].key, "hello1");
                assert.equal(ast.variables[0].val, "World1");

                ast.variables[0].key = "hello2"
                ast.variables[0].val = "World2"

                serialize(ast, function (err, src) {

                    assert.equal(src, "$ hello2 = \"World2\"\n\n");
                    done();
                });

            });
        });
    });

    describe('Object.md', function () {
        it('should parse and serialize', function (done) {
            var file = path.join(__dirname, 'parser', 'Object.md');
            compose(file, null, function (err, ast) {

                assert.equal(ast.variables[0].key, "str");
                assert.equal(ast.variables[0].val, "Lala");

                assert.equal(ast.variables[1].key, "obj1");
                assert.equal(ast.variables[1].val, "{\n    \"hello1\" : str\n}");

                assert.equal(ast.variables[1].variables[0].key, "hello1");
                assert.equal(ast.variables[1].variables[0].val, "str");
                assert.equal(ast.variables[1].variables[0].link.val, "Lala");


                ast.variables[0].val = "YOLO";
                assert.equal(ast.variables[0].val, "YOLO");
                assert.equal(ast.variables[1].variables[0].link.val, "YOLO");

                serialize(ast, function (err, src) {

                    assert.equal(src, "$ str = \"YOLO\"\n\n$ obj1 = {\n\t\"hello1\" : str\n}\n\n");
                    done();
                });

            });
        });
    });

    describe('ImportObjectOverwrite.md', function () {
        it('should parse and serialize', function (done) {
            var file = path.join(__dirname, 'parser', 'ImportObjectOverwrite.md');
            compose(file, null, function (err, ast) {

                assert.equal(ast.variables.length, 2)
                assert.equal(ast.variables[0].key, "obj3");

                assert.equal(ast.variables[0].variables.length, 1)
                assert.equal(ast.variables[0].variables[0].key, "hello1");
                assert.equal(ast.variables[0].variables[0].val, "World2");

                assert.equal(ast.variables[1].variables[1].key, "obj1");
                assert.equal(ast.variables[1].variables[1].link.variables[0].val, "World2");

                ast.variables[0].variables[0].val = "YOLO";

                assert.equal(ast.variables[0].variables[0].val, "YOLO");

                console.log(JSON.stringify(ast, null, 4));

                serialize(ast, function (err, src) {

                    assert.equal(src, "$ obj3 = {}\n\n$ obj2 = [./Object.md] => {\n\t\"obj1\" : obj3\n}\n\n");
                    fs.writeFileSync('jolo.md', src)
                    done();
                });

            });
        });
    });


});