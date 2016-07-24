var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('compose', function () {

    var compose = require('../src/compose');
    var serialize = require('../src/serialize');

    describe('Variable.md', function () {
        it('should parse variable and serialize back', function (done) {
            var file = path.join(__dirname, 'parser', 'Variable.md');
            compose(file, null, function (err, ast) {

                assert.equal(ast.variables[0].key, "valuationCap");
                assert.equal(ast.variables[0].val, "$1,000,000");

                compose(ast, function (err, doc) {
                    done();
                });

            });
        });
    });



});