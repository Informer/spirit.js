// Karma configuration

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [],
		exclude: [],
		reporters: ['progress'],
		port: 9999,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['Chrome'],
		captureTimeout: 5000,
		singleRun: true
	});
};
