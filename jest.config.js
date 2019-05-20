module.exports = {
	verbose: true,
	testEnvironment: "jest-environment-jsdom-global",
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	transform: {
		"^.+\\.(jsx?|tsx?)$": "babel-jest"
	},
	//babel-jest ignore node_module so es modules won't compile. Add an not match to overcome this
	//https://stackoverflow.com/questions/42226674/babel-jest-doesnt-handle-es6-within-modules
	transformIgnorePatterns: ["/node_modules/(?!@voplus).+\\.js$"],
	moduleNameMapper: {
		"^.+\\.(css|less)$": "identity-obj-proxy"
	},
	testPathIgnorePatterns: ["/node_modules/", "/__tests__/setup/"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	//enzyme setup
	setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup/jest.setup.ts"],
	snapshotSerializers: ["enzyme-to-json/serializer"],

	// setup localStorage
	setupFiles: ["jest-localstorage-mock"]
};
