var express = require('express');
var bodyParser = require('body-parser')

var fs = require('fs');
var path = require('path');

var router = express.Router();

router.use(bodyParser.text({ type: 'text/plain' }))

router.get('*', function(req, res, next){
    var file = path.join(__dirname, '../doc', req.path)
    fs.readFile(file, function(err, text){
        if(err) return next(err);
        res.send(text)
    })
});

router.post('*', function(req, res, next){
    var file = path.join(__dirname, '../doc', req.path);
    var text = req.body;
    console.log(text)
    fs.writeFile(file, text, function(err, text){
        if(err) return next(err);
        res.send(text)
    })
});

module.exports = router;