var path = require('path');

module.exports = {
    entry: './src/ReactiveStore.js',
    output: {
        filename: 'lib/reactive-store.js',
        library: 'reactive-store',
        libraryTarget: "umd",
    },
    node: {
        global: false
    },
    externals: {
        'lodash': true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};


