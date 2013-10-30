(function(ns) {

	'use strict';


	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	ns.AbstractModel = function(attributes, options) {

		/* jshint -W030 */

		var attrs = attributes || {};
		options || (options = {});
		this.cid = _.uniqueId('c');
		this.attributes = {};
		if (options.collection) {
			this.collection = options.collection;
		}
		if (options.parse) {
			attrs = this.parse(attrs, options) || {};
		}
		attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
		this.set(attrs, options);
		this.changed = {};
		this.initialize.apply(this, arguments);

		this._construct(options);
	};

	ns.AbstractModel._idIterator = 1;
	ns.AbstractModel.extend = _.extendObjectWithSuper;
	_.extend(ns.AbstractModel.prototype, use('spirit.event').Events, {

	});



})(use('spirit.model'));
