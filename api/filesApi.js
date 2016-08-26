var express = require('express');

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

var recursive = require('recursive-readdir');

var location = path.resolve(__dirname, '../node_modules/cmacc-docs/doc');


var router = express.Router();

router.get('*', function (req, res, next) {
    recursive(location, function (err, files) {
        // Files is an array of filename

        files = files.map(function (file) {
            return file.replace(location, 'doc');
        });

        res.send(files)
    });
});

router.post('*', function (req, res, next) {

    var file = path.resolve(location, '.' + req.path);
    mkdirp(path.dirname(file), function (err) {

        if (err)
            return console.error(err);

        fs.writeFile(file, 'Hello World', function () {
            res.send();
        });

    });
});

module.exports = router;