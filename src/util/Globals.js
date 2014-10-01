
/**
 * Determine debug mode
 * @type {Boolean}
 */
var debug = true;

/**
 * Make helpers globally available
 * @type {Object}
 */
var _ = use('spirit._helpers');

/**
 * Prints log messages in debug mode
 * @returns {Boolean}
 */
var log = function() {
	/* jshint -W106 */
	/* jshint -W116 */
	if (!!(window.__karma__)) {
		return false;
	}

	if (window.console && _.isFunction(window.console.log)) {
		var args = [].slice.call(arguments);
		args.unshift('Spirit: ->');
		console.log.apply(console, args);
	}

	return true;
};

/**
 * Global defaults
 * @type {Object}
 */
var globalDefaults = {
	tween: _.isFunction(window.TweenMax) ? window.TweenMax : window.TweenLite,
	timeline: _.isFunction(window.TimelineMax) ? window.TimelineMax : window.TimelineLite
};
