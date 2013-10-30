(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	ns.AbstractCollection = function(models) {
		this._construct(models);
	};


	ns.AbstractCollection.extend = _.extendObjectWithSuper;
	_.extend(ns.AbstractCollection.prototype, use('spirit.event').Events, {


	});

	/**
	 * Mark as parseable
	 * In model.defaults {} we can provide class, while creating instance defaults will be set
	 * @type {boolean}
	 */
	ns.AbstractCollection.parseable = true;


})(use('spirit.collection'));