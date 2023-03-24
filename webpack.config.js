const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/index.ts'),
    output: {
        filename: 'connect.js',
        path: path.join(__dirname, './dist'),
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
                query: {
                    declaration: false,
                },
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        minimize: false
    },
};
