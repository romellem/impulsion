module.exports = function babelConfig(api) {
	api.cache(true);

	return {
		presets: [
			'@babel/preset-env',
		],
		comments: false,
	};
};
