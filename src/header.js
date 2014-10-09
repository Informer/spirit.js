//{banner}
(function(global){

	/**
	 * Object to store namespace in
	 * This will eventually be exposed on window or returned as module
	 * @type {Object}
	 */
	var context = {
		spirit: {
			VERSION: "{buildversion}"
		}
	};

  /**
   * Do not expose this object publicly
   * Only for internal use.
   * @type {Object}
   */
  var contextInternally = {};

	/**
	 * Resolves namespace
	 * @param {String} namespace
   * @param {Boolean} expose public
	 * @returns {Object} recursive namespace
	 */
	var use = function(namespace, exposePublic) {

		var segments = namespace.split('.');

		for (var i = 0, len = segments.length, obj = (exposePublic ? context : contextInternally); i < len; ++i) {
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
	 * @param {String} namespace (example spirit.model.fixture)
	 * @returns {Boolean}
	 */
	var exist = function(namespace, exposePublic) {
		if (typeof namespace !== 'string') {
			return false;
		}
		var segments = namespace.split('.');
		var doesExist = true;

		for (var i = 0, len = segments.length, obj = (exposePublic ? context : contextInternally); i < len; ++i) {
			var segment = segments[i];

			if (!obj[segment]) {
				doesExist = false;
				break;
			}
			obj = obj[segment];
		}

		return doesExist;
	};
