const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        polyfill: 'babel-polyfill',
        app: path.join(__dirname, '/src/index.js')
    },

    output: {
        publicPath: 'bundle/',
        path: path.join(__dirname, '/web/bundle'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader',
                options: {
                    interpolate: false,
                    minimize: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [
                        // { loader: 'style-loader', options: { sourceMap: true } },
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'postcss-loader', options: { sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.glsl$/,
                exclude: /node_modules/,
                loader: 'shader-loader'
            },
            {
                test: /\.(jpe?g|png|bmp|gif|svg|woff|woff2|eot|ttf|obj|mtl|fbx|ogg)$/,
                exclude: /node_modules/,
                loader: 'url-loader',
                options: {
                    name: 'resources/[hash:12].[ext]',
                    limit: 1000
                }
            }
        ]
    },

    plugins: [
        new WebpackCleanupPlugin(),
        new ExtractTextPlugin('[name].css'),
    ],

    resolve: {
        modules: [
            path.join(__dirname, '/src'),
            path.join(__dirname, '/node_modules')
        ]
    },

    node: {
        fs: 'empty'
    },

    devtool: 'eval source-map',

    devServer: {
        host: '127.0.0.1',
        port: 4200,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000/api',
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/socket': {
                target: 'http://127.0.0.1:3000',
                ws: true
            }
        },
        stats: 'minimal',
        inline: true,
        overlay: true,
        compress: true,
        contentBase: path.join(__dirname, '/web'),
        historyApiFallback: true
    }
};
