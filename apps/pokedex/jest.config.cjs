const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	testEnvironment: "jsdom",

	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
	},

	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",

		"^next/image$": "<rootDir>/__mocks__/nextImageMock.js",

		"^@/(.*)$": "<rootDir>/$1",
	},

	transformIgnorePatterns: ["/node_modules/"],

	verbose: true,
};

module.exports = createJestConfig(customJestConfig);
