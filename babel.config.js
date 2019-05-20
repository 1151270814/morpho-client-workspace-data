module.exports = {
	presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
	env: {
		test: {
			//https://mobx.js.org/best/decorators.html
			plugins: [
				["@babel/plugin-proposal-decorators", { legacy: true }],
				["@babel/plugin-proposal-class-properties", { loose: true }]
			]
		}
	}
};
