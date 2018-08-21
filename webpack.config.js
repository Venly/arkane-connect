const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/src/connect/connect.ts'),
    output: {
        filename: 'connect.js',
        path: '/Users/steve/work/fnd/arkane-website/assets/js/vendor/arkane-connect'
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
                query: {
                    // Use this to point to your tsconfig.json.
                    configFileName: './tsconfig-es5.json',
                    declaration: false,
                }
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};