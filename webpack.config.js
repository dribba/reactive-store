var path = require('path');

// webpack.config.js
module.exports = {
    entry: './src/reactive-store-for-browser.js',
    output: {
        filename: 'dist/reactive-store-for-browser.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader' }
        ]
    },
    devtool: "#inline-source-map"
};

