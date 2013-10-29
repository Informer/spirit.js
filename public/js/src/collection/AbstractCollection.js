(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');



	ns.AbstractCollection = function(options) {
		this._construct(options);
	};

	ns.AbstractCollection.extend = _.extendObjectWithSuper;
	ns.AbstractCollection.prototype = {

		model: null,

		_construct: function(options){
			if (!_.testMode()) {
				console.log('AbstractCollection -> _construct', options);
			}
		}

	};

	/**
	 * Mark as parseable
	 * In model.defaults {} we can provide class, while creating instance defaults will be set
	 * @type {boolean}
	 */
	ns.AbstractCollection.parseable = true;




})(use('spirit.collection'));
