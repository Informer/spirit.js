(function(ns) {

	'use strict';

	ns.TransitionModel = ns.AbstractModel.extend({

		defaults: {
      frame: 0,
			params: null,
			ease: 'Linear.easeNone'
		}

	});

})(use('spirit.model'));
