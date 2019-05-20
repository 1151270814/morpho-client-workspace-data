const path = require("path");
const theme = require("./src/styles/theme");
const tsImportPlugin = require("ts-import-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = mode => {
	var extractOrStyleLoader = mode === "production" ? MiniCssExtractPlugin.loader : "style-loader";

	let tsLoaderUses = [];

	// babel-loader to transform esnext js to es5.
	const babelLoader = {
		loader: "babel-loader",
		options: {
			presets: ["@babel/preset-env"]
		}
	};

	// ts loader for typescript, compile to esnext
	const tsLoader = {
		loader: "ts-loader",
		options: {
			configFile: mode === "production" ? "tsconfig.prod.json" : "tsconfig.dev.json",
			getCustomTransformers: () => ({
				before: [
					tsImportPlugin({
						libraryDirectory: "es",
						libraryName: "@voplus/antd",
						style: true
					})
				]
			})
		}
	};

	// use babel-loader for tsx only in production to avoid source map issues
	if (mode === "production") tsLoaderUses.push(babelLoader);

	// use ts loader for tsx
	tsLoaderUses.push(tsLoader);

	return {
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: tsLoaderUses
				},
				// less support for project
				// chain less -> css loader (module support) -> style loader (inject styles tag into DOM)
				{
					test: /\.less$/,
					include: [path.join(__dirname, "/src")],
					use: [
						{ loader: extractOrStyleLoader },
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
								modules: true,
								localIdentName: "[local]___[hash:base64:5]"
							}
						},
						{
							loader: "less-loader",
							options: {
								javascriptEnabled: true,
								modifyVars: theme
							}
						}
					]
				},
				// less support for antd
				// javascriptEnabled are required for antd
				{
					test: /\.less$/,
					include: [path.join(__dirname, "/node_modules/@voplus/antd")],
					use: [
						{ loader: extractOrStyleLoader },
						{ loader: "css-loader" },
						{
							loader: "less-loader",
							options: {
								javascriptEnabled: true,
								modifyVars: theme
							}
						}
					]
				},
				// css for project
				{
					test: /\.css$/,
					loader: "style-loader!css-loader"
				}
			]
		},
		resolve: {
			extensions: [
				//required for ts imports
				".tsx",
				".ts",
				//required for js imports (mostly in webpack dev self dependency)
				".js",
				".css"
			]
		},
		plugins: [new ProgressBarPlugin()]
	};
};
