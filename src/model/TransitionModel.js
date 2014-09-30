(function(ns) {

	'use strict';

	ns.TransitionModel = ns.AbstractModel.extend({

		defaults: {
			params: null,
			ease: 'Linear.easeNone'
		}

	});

})(use('spirit.model'));
