var path = require('path');
var glob = require('glob');
var fs = require('fs');

// webpack.config.js
module.exports = {
    entry: glob.sync(__dirname+'/spec/**/*Spec.js'),
    output: {filename: __dirname + '/tests.js'},
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader'}
        ]
    },
    devtool: "#inline-source-map",
    resolve: {
        alias: {
            ReactiveStore: path.normalize(__dirname + '/../src/reactiveStore.js'),
            MetaStore: path.normalize(__dirname + '/../src/MetaStore.js'),
            Dict: path.normalize(__dirname + '/../src/Dict.js')
        }
    }
};

