const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, argv) => {
    return {
        entry: "./src/js/main.js",
        output: {
            filename: "js/[name]-[hash:6].js"
        },
        optimization: {
            minimize: argv.mode === "production",
            minimizer: [
                new TerserPlugin({
                    sourceMap: argv.mode !== "production"
                }),
                new OptimizeCSSAssetsPlugin()
            ],
        },
        devtool: argv.mode !== "production" ? 'source-map' : false,
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: "html-loader"
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /fa-.*\.(woff2|woff|eot|svg|ttf)$/,
                    loader: [{
                        loader: "file-loader",
                        options: {
                            name: "[name]-[hash:6].[ext]",
                            outputPath: "fonts/",
                            publicPath: "../fonts"
                        }
                    }]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new MiniCssExtractPlugin({
                filename:  "css/[name]-[hash:6].css",
                sourceMap: argv.mode !== "production",
                hmr: argv.mode !== "production",
                reloadAll: true
            }),
            new Dotenv(),
            new webpack.LoaderOptionsPlugin({
                options: {
                    postcss: [
                        autoprefixer()
                    ]
                }
            })
        ]
    }
};