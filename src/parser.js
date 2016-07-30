var imp = require('./import');

var regex = require('./regex');

var parser = function (file, callback) {

    var ast = {
        file: file,
        variables: [],
        text: undefined,
        src: undefined
    };

    imp.readFile(file, function (err, text) {

        if (err)
            return callback(err)

        ast.src = text;

        text = text.replace(regex.REGEX_VARIABLE, function (found, key, ref, val) {
            ast.variables.push({
                key: key,
                ref: ref,
                val: val
            });
            return '';
        });

        if (text && text !== '')
            ast.text = text;

        callback(null, ast);

    });
};

module.exports = parser;