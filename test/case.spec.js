var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('parse', function () {

    var cmacc = require('../src/index');

    var convert = cmacc.convert;
    var parse = cmacc.parse;
    var resolve = cmacc.resolve;

    var run = function (file) {
        var js = convert(file);
        var ast = parse(js);
        //console.log(JSON.stringify(ast,null,4));
        var result = resolve(ast);
        return result;
    };

    describe('id', function () {
        it('should parse doc.cmacc', function (done) {
            var file = path.join(__dirname, 'case', './id/doc.cmacc');

                var result = run(file);

                assert.equal(result, "Name: Willem Veelenturf");
                done()




        });
    });

});