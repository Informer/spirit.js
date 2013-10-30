(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
//	var _ = use('spirit._helpers');


	ns.TransitionModel = ns.AbstractModel.extend({

		defaults: {
			params: null,
			ease: 'Linear.easeNone'
		},

		initialize: function() {

		}

	});


})(use('spirit.model'));
