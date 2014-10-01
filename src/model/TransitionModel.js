(function(ns) {

	'use strict';

	ns.TransitionModel = ns.AbstractModel.extend({

		defaults: {
      frame: 0,
			params: 'spirit.collection.TransitionParamCollection',
			ease: 'Linear.easeNone'
		}

	});

})(use('spirit.model'));
