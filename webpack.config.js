var path = require('path');
var BeepPlugin = require('webpack-beep-plugin');


module.exports = {
    entry: './src/ReactiveStore.js',
    output: {
        filename: 'lib/ReactiveStore.js',
        libraryTarget: "umd",
    },
    node: {
        global: false
    },
    externals: {
        'lodash': true,
        'ramda': true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [/node_modules/],
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [new BeepPlugin()]

};


