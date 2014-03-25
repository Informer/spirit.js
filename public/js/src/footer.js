


	/**
	 * Finally make spirit namespace available
	 * if we're running in AMD environment return context as module
	 * else expose it on global (window) object
	 */
	if (typeof global.define === "function" && global.define.amd) {
		global.define('spiritjs', [], function(){
			return context;
		});
	}else {
		_.extend(global, context);
	}


})(window);
