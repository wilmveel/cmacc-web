var assert = require('assert');

var fs = require('fs');
var path = require('path');

var marked = require('marked');

describe('parse', function () {

    var cmacc = require('../src/index');
    var convert = cmacc.convert;
    var parse = cmacc.parse;

    describe('ImportVariable.cmacc', function () {
        it('should convert Variable.cmacc', function (done) {
            var file = path.join(__dirname, 'parse', 'Variable.cmacc');

            var js = convert(file);
            var result = parse(js);

            console.log(JSON.stringify(result, null, 4));

            assert.equal(result.vars.hello1, 'World1');
            done()
        });
    });


});