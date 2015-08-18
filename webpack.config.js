// webpack.config.js
module.exports = {
    entry: './src/reactiveStore.js',
    output: {
        filename: 'dist/reactiveStore.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader' }
        ]
    },
    devtool: "#inline-source-map",
    resolve: {
        alias: {
        }
    }
};

