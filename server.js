var express = require('express');

var port = process.env.PORT || 3000;

var app = express();

app.use('/', express.static('./'));
app.use('/', express.static('./bower_components'));

app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});