const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");

const mode = "production";

module.exports = merge(common(mode), {
    mode: mode,
    devtool: "source-map",
    output: {
        //filename: "[name].[hash].js",
        //library: "samplelib",
        libraryTarget: "umd"
    },
    //Add react as external
    externals: [nodeExternals()],
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new MiniCssExtractPlugin({
            //filename: "[name].[hash].css",
            //chunkFilename: "[id].[hash].css"
            //filename: "index.css"
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
});
