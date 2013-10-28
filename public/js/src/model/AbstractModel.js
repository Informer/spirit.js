(function(ns) {

	'use strict';


	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	ns.AbstractModel = function(options) {
		this._construct(options);
	};

	ns.AbstractModel.extend = _.extendObjectWithSuper;
	ns.AbstractModel.prototype = {

		defaults: {},

		_construct: function(options) {
			this.attributes = _.extend({}, this.defaults, options || {});
			this.initialize(options);
		},

		initialize: function(options) {
			_.isFunction(options);
			return this;
		},

		toJSON: function() {
			if (!JSON || !_.isFunction(JSON.stringify)) {
				throw 'JSON.stringify does not exist. Download JSON 3 for polyfilling older browsers: http://bestiejs.github.io/json3/';
			}

			return JSON.stringify(this.attributes);
		},

		get: function(value) {
			return this.attributes[value];
		},

		set: function(prop, val) {
			if (typeof prop === 'object') {
				_.each(prop, function(val, key) {
					this.attributes[key] = val;
				}, this);
			} else {
				this.attributes[prop] = val;
			}
			return this;
		}


	};


})(use('spirit.model'));
