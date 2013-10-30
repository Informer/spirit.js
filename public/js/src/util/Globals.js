(function(global) {

	'use strict';

	/**
	 * Resolves namespace
	 * @param {string} namespace
	 * @returns {} recursive namespace
	 */
	global.use = function(namespace) {

		var segments = namespace.split('.');

		for (var i = 0, len = segments.length, obj = window; i < len; ++i) {
			var segment = segments[i];
			if (!obj[segment]) {
				obj[segment] = {};
			}
			obj = obj[segment];
		}

		return obj;
	};


	/**
	 * Check if namespace exists
	 * @param {string} namespace
	 * @returns {boolean}
	 */
	global.exist = function(namespace) {
		var segments = namespace.split('.');
		var doesExist = true;

		for (var i = 0, len = segments.length, obj = window; i < len; ++i) {
			var segment = segments[i];

			if (!obj[segment]) {
				doesExist = false;
				break;
			}
			obj = obj[segment];
		}

		return doesExist;
	};

})(window);