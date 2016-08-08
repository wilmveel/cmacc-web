var url = require('url');
var express = require('express');

var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require('./webpack.config');
var proxy = require('proxy-middleware');

var port = process.env.PORT || 3000;

var app = express();

// Webpack
app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: "/assets/"
}));

// IPFS
app.use('/ipfs', proxy(url.parse('https://gateway.ipfs.io/ipfs/')));

// Static
app.use('/doc', require('./api/docApi'));
app.use('/dist', require('./api/vulcanizeApi'));

app.use('/', express.static(process.cwd() + '/public'));
app.use('/', express.static(process.cwd() + '/bower_components'));

app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});