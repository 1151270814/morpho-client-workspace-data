const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const mode = "development";

module.exports = merge(common(mode), {
    mode: mode,
    devtool: "inline-source-map",
    plugins: [
        //Add Html plugin to generate testing html
        new HtmlWebPackPlugin({ template: "./public/index.html" })
    ]
});
