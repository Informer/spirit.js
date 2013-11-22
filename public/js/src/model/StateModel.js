(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
//	var _ = use('spirit._helpers');


	ns.StateModel = ns.AbstractModel.extend({

		defaults: {
			name: 'undefined',
			tweenObj: {}
		}

	});


})(use('spirit.model'));
