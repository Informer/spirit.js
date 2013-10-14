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

})(window);;(function(ns) {

	'use strict';

	ns.Spirit = function() {
		this.initialize();
	};

	ns.Spirit.prototype = {

		initialize: function() {
			// code
		}

	};

})(use('spirit'));


