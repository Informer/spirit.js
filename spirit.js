(function(global) {

	'use strict';

	/**
	 * Resolves namespace
	 * @param {string} namespace
	 * @returns {} recursive namespace
	 */
	global.use = function(namespace) {

		var segments = namespace.split('.');

		for (var i = 0, len = segments.length, obj = window; i < len; ++i) {
			var segment = segments[i];
			if (!obj[segment]) {
				obj[segment] = {};
			}
			obj = obj[segment];
		}

		return obj;
	};

})(window);;(function(ns) {

	'use strict';


	/**
	 * Borrowed from underscorejs.
	 * Has prop?
	 * @param obj
	 * @param key
	 * @returns {boolean}
	 */
	ns.has = function(obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	/**
	 * Borrowed from underscorejs.
	 * Returs all keys of object
	 * @type {Array}
	 */
	ns.keys = Object.keys || function(obj) {
		if (obj !== Object(obj)) {
			throw new TypeError('Invalid object');
		}
		var keys = [];
		for (var key in obj) {
			if (ns.has(obj, key)) {
				keys.push(key);
			}
		}
		return keys;
	};

	/**
	 * Borrowed from underscorejs.
	 * The cornerstone, an `each` implementation, aka `forEach`.
	 * Handles objects with the built-in `forEach`, arrays, and raw objects.
	 * Delegates to **ECMAScript 5**'s native `forEach` if available.
	 * @param obj
	 * @param iterator
	 * @param context
	 */
	ns.each = function(obj, iterator, context) {
		if (obj === null) {
			return;
		}

		var i, length;

		if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
			obj.forEach(iterator, context);
		} else if (obj.length === +obj.length) {
			for (i = 0, length = obj.length; i < length; i++) {
				if (iterator.call(context, obj[i], i, obj) === {}) {
					return;
				}
			}
		} else {
			var keys = ns.keys(obj);
			for (i = 0, length = keys.length; i < length; i++) {
				if (iterator.call(context, obj[keys[i]], keys[i], obj) === {}) {
					return;
				}
			}
		}
	};

	/**
	 * Borrowed from underscorejs.
	 * Extend a given object with all the properties in passed-in object(s).
	 * @type {Function}
	 */
	ns.extend = function(obj) {
		ns.each(Array.prototype.slice.call(arguments, 1), function(source) {
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};


	ns.extendObject = function(protoProps, staticProps) {
		var parent = this;
		var child;

		if (protoProps && ns.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function(){ return parent.apply(this, arguments); };
		}

		ns.extend(child, parent, staticProps);

		var Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate();

		if (protoProps) {
			ns.extend(child.prototype, protoProps);
		}

		/* jshint -W106 */
		child.__super__ = parent.prototype;

		return child;
	};



})(use('spirit._helpers'));;(function(ns) {

	'use strict';


	/**
	 * Get helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	/**
	 *
	 * @param $container {HTMLElement} DOM element holding the animateable items
	 * @param options {{}} custom configuration
	 * @constructor
	 */
	ns.Timeline = function($el, options) {
		this.$el = $($el);
		_.extend(this._options, options || {});

		this._construct();
	};

	ns.Timeline.extend = _.extendObject;
	ns.Timeline.prototype = {


		/**
		 * @private
		 */
		_options: {},
		_debug: false,
		_timeline: null,

		/**
		 * @public
		 */
		preConstructTimeline: null,
		$container: null,


		/**
		 * Constructor
		 * @private
		 */
		_construct: function(){
			this.initialize();
		},

		/**
		 * Initialize
		 * Invoked by constructor
		 * @public
		 */
		initialize: function() {},

		/**
		 * Turn debug on/off
		 * @param {boolean} debuggable
		 */
		debug: function(debuggable){
			this._debug = debuggable;
			// debug logic
		},

		/**
		 * Get debug modus
		 * @returns {boolean}
		 */
		isDebug: function(){
			return this._debug;
		},


		/**
		 * Update timeline
		 * @param frame {Number} pixels
		 * @returns {*}
		 */
		update: function(frame){
			return frame;
		},


		/**
		 * Extract JSON
		 * @returns {{}}
		 */
		toJSON: function(){
			return {};
		},

		/**
		 * Parse JSON
		 */
		parseJSON: function() {
			// parse json here
		},

		/**
		 * Kill THE SPIRIT
		 */
		dispose: function(){
		}
	};

	/**
	 * Extend Events
	 */
	_.extend(ns.Timeline.prototype, {

		on: function(){},
		off: function(){},
		trigger: function(){}

	});



})(use('spirit'));


