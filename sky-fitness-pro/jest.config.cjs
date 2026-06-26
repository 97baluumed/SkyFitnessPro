module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: "tsconfig.app.json" }],
	},
	moduleNameMapper: {
		"\\.(css|less|sass|scss)$": "identity-obj-proxy",
	},
};
