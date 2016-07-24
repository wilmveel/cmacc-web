var path = require('path');

module.exports = {
    entry: './src/cmacc.js',

    output: {
        path: path.resolve(__dirname, "assets"),
        filename: "bundle.js",
        library: "cmacc"
    },
    node: {
        fs: "empty",
        request: "empty"
    },
    externals: {
        "request": "notexist"
    },
    module: {
        loaders: [
            { test: /\.json/, loader: 'json' }
        ]
    },
};