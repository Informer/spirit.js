
  /**
   * Expose spiritLoaded on window and dispatch event
   * This way we make sure that the chrome extension gets notified
   */
  var dispatchLoadedEvent = function(ins){
    window.spiritLoaded = true;
    var loadEvt;
    if (_.isFunction(window.CustomEvent)) {
      loadEvt = new CustomEvent('spirit-loaded', {detail: ins});
    }else{
      loadEvt = document.createEvent('Event');
      loadEvt.initEvent('spirit-loaded', true, true);
      loadEvt.detail = ins;
    }
    if (loadEvt) {
      window.dispatchEvent(loadEvt);
    }
  };

	/**
	 * Finally make spirit namespace available
	 * if we're running in AMD environment return context as module
	 * else expose it on global (window) object
	 */
	if (typeof define === "function" && define.amd) {
		define(function() {
      var ins = context.spirit || {};
      dispatchLoadedEvent(ins);
			return ins;
		});
	}else {
		_.extend(global, context);
    dispatchLoadedEvent(context.spirit);
	}

})(window);
