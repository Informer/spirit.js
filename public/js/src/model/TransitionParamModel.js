(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	ns.TransitionParamModel = ns.AbstractModel.extend({

		initialize: function() {
			console.log('TransitionParamModel -> initialize', _.isPrototypeOf(this));
		}

	});


})(use('spirit.models'));
