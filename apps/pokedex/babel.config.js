const isCI = process.env.CI === "true" || process.env.NODE_ENV === "production";

if (isCI) {
	console.log("Skipping Babel config in CI/Production (SWC active)");
	module.exports = {};
} else {
	module.exports = {
		presets: ["next/babel"],
	};
}
