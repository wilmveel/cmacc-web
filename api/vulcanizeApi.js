var express = require('express');

var fs = require('fs');
var path = require('path');

var location = './public/index.html';

var Vulcanize = require('vulcanize');

var vulcan = new Vulcanize({
    abspath: '',
    //excludes: [
    //    '\\.css$'
    //],
    stripExcludes: [],
    inlineScripts: false,
    inlineCss: false,
    addedImports: [],
    redirects: [],
    implicitStrip: true,
    stripComments: false
});

var router = express.Router();

router.get('*', function (req, res, next) {
    vulcan.process(location, function (err, inlinedHtml) {
        res.send(inlinedHtml)
    });
});

module.exports = router;