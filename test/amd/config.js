// http://karma-runner.github.io/0.8/plus/RequireJS.html

var tests = [];
for (var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
		if (/Spec\.js$/.test(file)) {
			tests.push(file);
		}
	}
}

requirejs.config({
	// Karma serves files from '/base'
	baseUrl: '/base',

	paths: {
		'jquery':           'vendor/jquery/jquery',
		'tweenlite':        'vendor/greensock-js/src/minified/TweenLite.min',
		'timelinelite':     'vendor/greensock-js/src/minified/TimelineLite.min'
	},

	shim: {
		'spirit.min': {
			deps: [
				'jquery',
			    'tweenlite',
			    'timelinelite'
			]
		},

		'tweenlite': {
			deps: [
				'vendor/greensock-js/src/minified/plugins/CSSPlugin.min',
				'vendor/greensock-js/src/minified/easing/EasePack.min'
			]
		}
	},

	// ask Require.js to load these files (all our tests)
	deps: tests,

	// start test run, once Require.js is done
	callback: window.__karma__.start
});
