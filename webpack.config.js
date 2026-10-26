const { resolve } = require("path");
const wordpressConfig = require("@wordpress/scripts/config/webpack.config");
const DependencyExtractionWebpackPlugin = require("@wordpress/dependency-extraction-webpack-plugin");

// Keep the public bundle names stable while main.js owns the complete theme entry.
module.exports = {
	...wordpressConfig,
	entry: {
		index: resolve(__dirname, "assets/main.js"),
	},
	plugins: wordpressConfig.plugins.map((plugin) => {
		if (!(plugin instanceof DependencyExtractionWebpackPlugin)) return plugin;
		return new DependencyExtractionWebpackPlugin({
			...plugin.options,
			requestToExternal(request) {
				// Bundle Babel's runtime so its import cannot capture an uninitialized global.
				if (request === "@babel/runtime/regenerator") return false;
				return plugin.options.requestToExternal?.(request);
			},
		});
	}),
};
