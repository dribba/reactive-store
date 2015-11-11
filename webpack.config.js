var path = require('path');
var BeepPlugin = require('webpack-beep-plugin');


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
    devtool: "#inline-source-map",
    plugins: [new BeepPlugin()]
};

