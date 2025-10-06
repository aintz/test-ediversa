const isCI = process.env.CI === "true";

if (isCI) {
	console.log(
		"Skipping custom Babel config in CI for faster builds (SWC active).",
	);
	module.exports = {};
} else {
	module.exports = {
		presets: [
			["@babel/preset-env", { targets: { node: "current" } }],
			[
				"@babel/preset-react",
				{
					runtime: "automatic",
				},
			],
			"@babel/preset-typescript",
		],
	};
}
