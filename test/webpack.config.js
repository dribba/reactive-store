var path = require('path');
var glob = require('glob');
var BeepPlugin = require('webpack-beep-plugin');

module.exports = {
    entry: glob.sync(__dirname + '/spec/**/*Spec.js'),
    output: {
        filename: path.join(__dirname, 'build', 'tests.js')
    },
    module: {
        loaders: [{
            test: /\.js$/, 
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }]
    },
    devtool: "#inline-source-map",
    resolve: {
        alias: {
            src: path.resolve('../src')
        }
    },
    plugins: [new BeepPlugin()]
};

