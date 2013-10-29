(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
//	var _ = use('spirit._helpers');


	ns.ElementModel = ns.AbstractModel.extend({

		defaults: {
			el: null,
			id: null,
			transitions: use('spirit.collection').TransitionCollection
		},

		initialize: function(options) {
			this._super(options);
			return this;
		}

	});


})(use('spirit.model'));
