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
	_.extend(ns.AbstractModel.prototype, use('spirit.event').Events, {

		defaults: {},
		attributes: {},

		_construct: function(options) {

			_.autoBind(this);

			// create instances of default parseables
			_.each(this.defaults, function(val, key) {
				var ParseableObject = this._getParseableObject(key);
				if (ParseableObject) {
					this.defaults[key] = new ParseableObject();
				}
			}, this);

			// parse attributes
			this.attributes = _.extend({}, this.defaults);
			_.each(options || {}, function(val, key) {
				this.set(key, val);
			}, this);

			this.initialize(options);
		},

		_getParseableObject: function(key) {
			var PossibleClassObject = this.defaults[key];

			try {
				if (typeof PossibleClassObject === 'string' && exist(PossibleClassObject)) {
					PossibleClassObject = use(PossibleClassObject);
				}

				if (PossibleClassObject.parseable === true) {
					return PossibleClassObject;
				}

				if (PossibleClassObject.constructor.parseable === true) {
					return PossibleClassObject.constructor;
				}
			} catch (error) {}

			return false;
		},

		initialize: function(options) {
			_.isFunction(options);
			return this;
		},

		toJSON: function() {
			if (!JSON || !_.isFunction(JSON.stringify)) {
				throw 'JSON.stringify does not exist. Download JSON 3 for polyfilling older browsers: http://bestiejs.github.io/json3/';
			}

			return _.extend({}, this.attributes);
		},

		get: function(attr) {
			return this.attributes[attr];
		},

		set: function(key, val) {
			var setAttr = _.bind(function(key, val) {
				var PossibleParseableObject = this._getParseableObject(key);
				if (PossibleParseableObject) {
					this.attributes[key] = new PossibleParseableObject(val);
				} else {
					this.attributes[key] = val;
				}
			}, this);

			if (typeof key === 'object') {
				_.each(key, function(val, key) {
					setAttr(key, val);
				}, this);
			} else {
				setAttr(key, val);
			}
			return this;
		},

		has: function(attr) {
			return this.get(attr) !== null;
		}

	});


})(use('spirit.model'));
