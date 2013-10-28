(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');
	_.isFunction(this);


	ns.ElementModel = ns.AbstractModel.extend({

		defaults: {
			el: null,
			id: null,
			transitions: []
		},

		initialize: function(options) {
			this._super(options);
			return this;
		}

	});


})(use('spirit.model'));
