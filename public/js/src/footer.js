


	/**
	 * Finally make spirit namespace available
	 * if we're running in AMD environment return context as module
	 * else expose it on global (window) object
	 */
	if (typeof define === "function" && define.amd) {
		define(function() {
			return context.spirit || {};
		});
	}else {
		_.extend(global, context);
	}


})(window);
