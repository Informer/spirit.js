(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	ns.TransitionModel = ns.AbstractModel.extend({

		initialize: function() {
			console.log('TransitionModel -> initialize', _.isPrototypeOf(this));
		}

	});


})(use('spirit.models'));
