(function(global) {

	'use strict';

	// some AMD build optimizers, like r.js, check for condition patterns like the following:
	var isAMD = (typeof global.define === 'function' && typeof global.define.amd === 'object' && global.define.amd);
	var context = isAMD ? {} : global;


	/**
	 * Resolves namespace
	 * @param {string} namespace
	 * @returns {} recursive namespace
	 */
	context.use = function(namespace) {

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
	context.exist = function(namespace) {
		if (typeof namespace !== 'string') {
			return false;
		}
		var segments = namespace.split('.');
		var doesExist = true;

		for (var i = 0, len = segments.length, obj = context; i < len; ++i) {
			var segment = segments[i];

			if (!obj[segment]) {
				doesExist = false;
				break;
			}
			obj = obj[segment];
		}

		return doesExist;
	};



	// if we're running in an AMD environment, define our module
	if (isAMD) {
		global.define(function() {
			return context;
		});
	}

})(window);