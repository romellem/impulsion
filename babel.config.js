module.exports = function babelConfig(api) {
	api.cache(true);

	return {
		presets: [['@babel/preset-env', { modules: false }]],
		comments: false,
	};
};
