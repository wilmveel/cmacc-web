module.exports = {
    entry: './src/cmacc.js',

    output: {
        path: '/',
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