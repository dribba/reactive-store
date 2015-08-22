var path = require('path');
var glob = require('glob');
var fs = require('fs');

// webpack.config.js
module.exports = {
    entry: glob.sync(__dirname + "/spec/**/*Spec.js").reduce(function (ret, filename) {
        ret[path.basename(filename)] = filename;
        return ret;
    }, {}),
    output: {filename: __dirname + '/build/[name]'},
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader'}
        ]
    },
    devtool: "#inline-source-map",
    resolve: {
        alias: {
            ReactiveStore: path.normalize(__dirname + '/../src/reactiveStore.js')
        }
    }
//    resolve: {
//        alias: {
//        }
//    },
//    plugins: []
};

