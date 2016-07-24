var express = require('express');

var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require('./webpack.config');

var port = process.env.PORT || 3000;

var app = express();

// Static
app.use('/', express.static('./'));
app.use('/', express.static('./bower_components'));

// Webpack
app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: "/assets/"
}));

// IPFS
var IPFS = require('ipfs')
var node = new IPFS()

app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});