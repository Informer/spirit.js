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


	var ctor = function() {};


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


	/**
	 * Borrowed from underscorejs
	 * Validate param on function type
	 * @param fn {*}
	 * @return {boolean}
	 */
	if (typeof (/./) !== 'function') {
		ns.isFunction = function(obj) {
			return typeof obj === 'function';
		};
	}


	/**
	 * Borrowed from Backbone.extend
	 * @param protoProps {{}}
	 * @param staticProps {{}}
	 * @returns {{}}
	 */
	ns.extendObject = function(protoProps, staticProps) {
		var parent = this;
		var child;

		if (protoProps && ns.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() { return parent.apply(this, arguments); };
		}

		ns.extend(child, parent, staticProps);

		var Surrogate = function() { this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate();

		if (protoProps) {
			ns.extend(child.prototype, protoProps);
		}

		/* jshint -W106 */
		child.__super__ = parent.prototype;

		return child;
	};


	/**
	 * extendObjectWithSuper
	 * Borrowed from https://github.com/lukasolson/Backbone-Super
	 * Now we can use this._super() everywhere we extend Spirit
	 * @param parent
	 * @param protoProps
	 * @param staticProps
	 * @returns {*}
	 */
	var inherits = function(parent, protoProps, staticProps) {
		/* jshint -W030 */
		/* jshint -W055 */
		/* jshint -W116 */
		/* jshint -W083 */
		/* jshint -W106 */
		var child,
			_super = parent.prototype,
			fnTest = /xyz/.test(function(xyz) {xyz;}) ? /\b_super\b/ : /.*/;

		if (protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() { parent.apply(this, arguments); };
		}

		// Inherit class (static) properties from parent.
		ns.extend(child, parent);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) {
			ns.extend(child.prototype, protoProps);

			// Copy the properties over onto the new prototype
			for (var name in protoProps) {
				// Check if we're overwriting an existing function
				if (typeof protoProps[name] == "function" && typeof _super[name] == "function" && fnTest.test(protoProps[name])) {
					child.prototype[name] = (function(name, fn) {
						return function() {
							var tmp = this._super;

							// Add a new ._super() method that is the same method
							// but on the super-class
							this._super = _super[name];

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							var ret = fn.apply(this, arguments);
							this._super = tmp;

							return ret;
						};
					})(name, protoProps[name]);
				}
			}
		}

		// Add static properties to the constructor function, if supplied.
		if (staticProps) {
			ns.extend(child, staticProps);
		}

		// Correctly set child's `prototype.constructor`.
		child.prototype.constructor = child;

		// Set a convenience property in case the parent's prototype is needed later.
		child.__super__ = parent.prototype;

		return child;
	};
	ns.extendObjectWithSuper = function(protoProps, classProps) {
		var child = inherits(this, protoProps, classProps);
		child.extend = ns.extendObject;
		return child;
	};


	/**
	 * Borrowed from underscorejs
	 * Create a function bound to a given object (assigning this, and arguments, optionally)
	 * @param fn {*}
	 * @param context {{}} scope
	 * @return {{}}
	 */
	var nativeBind = Function.prototype.bind, slice = Array.prototype.slice;
	ns.bind = function(func, context) {
		/* jshint -W055 */
		/* jshint -W093 */
		var args, bound;
		if (nativeBind && func.bind === nativeBind) {
			return nativeBind.apply(func, slice.call(arguments, 1));
		}
		if (!ns.isFunction(func)) {
			throw new TypeError();
		}
		args = slice.call(arguments, 2);
		return bound = function() {
			if (!(this instanceof bound)) {
				return func.apply(context, args.concat(slice.call(arguments)));
			}
			ctor.prototype = func.prototype;
			var self = new ctor();
			ctor.prototype = null;
			var result = func.apply(self, args.concat(slice.call(arguments)));
			if (Object(result) === result) {
				return result;
			}
			return self;
		};
	};

	/**
	 * Borrowed from underscorejs
	 * Bind all of an object's methods to that object.
	 * Useful for ensuring that all callbacks defined on an object belong to it.
	 * @param obj {*}
	 * @return {{}}
	 */
	ns.bindAll = function(obj) {
		var funcs = slice.call(arguments, 1);
		if (funcs.length === 0) {
			throw new Error('bindAll must be passed function names');
		}
		ns.each(funcs, function(f) { obj[f] = ns.bind(obj[f], obj); });
		return obj;
	};

	/**
	 * Borrowed from underscorejs
	 * @param value
	 * @returns {*}
	 */
	ns.identity = function(value) {
		return value;
	};

	/**
	 * Borrowed from underscorejs
	 * Determine whether all of the elements match a truth test.
	 * @type {Function}
	 * @param obj {Array} list
	 * @param iterator {*} iterator
	 * @param context {scope}
	 * @return {boolean}
	 */
	ns.every = ns.all = function(obj, iterator, context) {
		/* jshint -W030 */
		/* jshint -W116 */
		iterator || (iterator = ns.identity);
		var result = true;
		if (obj == null) {
			return result;
		}
		if (Array.prototype.every && obj.every === Array.prototype.every) {
			return obj.every(iterator, context);
		}
		ns.each(obj, function(value, index, list) {
			if (!(result = result && iterator.call(context, value, index, list))) {
				return {};
			}
		});
		return !!result;
	};

	/**
	 * Borrowed from underscorejs
	 * Determine if at least one element in the object matches a truth test.
	 * @type {Function}
	 * @param obj {Array} list
	 * @param iterator {*} iterator
	 * @param context {scope}
	 * @return {boolean}
	 */
	ns.any = ns.some = function(obj, iterator, context) {
		/* jshint -W030 */
		/* jshint -W116 */
		iterator || (iterator = ns.identity);
		var result = false;
		if (obj == null) {
			return result;
		}
		if (Array.prototype.some && obj.some === Array.prototype.some) {
			return obj.some(iterator, context);
		}
		ns.each(obj, function(value, index, list) {
			if (result || (result = iterator.call(context, value, index, list))) {
				return {};
			}
		});
		return !!result;
	};

	/**
	 * Borrowed from underscorejs
	 * Return a sorted list of the function names available on the object.
	 * @param obj
	 * @returns {Array} sorted array
	 */
	ns.functions = function(obj) {
		var names = [];
		for (var key in obj) {
			if (ns.isFunction(obj[key])) {
				names.push(key);
			}
		}
		return names.sort();
	};

})(use('spirit._helpers'));;(function(ns) {

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
;(function(ns) {

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
;(function(ns) {

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


})(use('spirit.model'));
;(function(ns) {

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


})(use('spirit.model'));
;(function(ns) {

	'use strict';


	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');

	/**
	 * Logger
	 */
	var log = function() {
		if (this._debug && window.console && _.isFunction(window.console.log)) {
			var args = [].slice.call(arguments);
			args.unshift('Spirit: ->');
			console.log.apply(console, args);
		}
	};

	/**
	 * Default options
	 * @returns {{tweenEngine: {tween: *, timeline: *}, childSelector: string}}
	 */
	var defaultOptions = function() {
		return {
			tweenEngine: {
				tween: _.isFunction(window.TweenMax) ? window.TweenMax : window.TweenLite,
				timeline: _.isFunction(window.TimelineMax) ? window.TimelineMax : window.TimelineLite
			},
			childSelector: '*',
			forceDebug: false
		};
	};


	/**
	 *
	 * @param $el {HTMLElement} DOM element containing the animateable children
	 * @param options {{}} custom configuration
	 * @constructor
	 */
	ns.Timeline = function($el, options) {
		// validate and determine $el
		if (arguments.length === 0 || !(_.some([Array, HTMLElement, $], function(type) { return $el instanceof type; }))) {
			throw ns.Timeline.errorMessages.noContainerElementFound;
		}
		this.$el = $($($el).get(0));

		// setup options
		this._validateOptions(_.extend(this.options, defaultOptions(), options || {}));
		this._debug = !!(this.options.forceDebug);


		// construct Spirit
		this._construct();
	};

	ns.Timeline.extend = _.extendObjectWithSuper;
	ns.Timeline.prototype = {

		/**
		 * @private
		 */
		_json: {},


		/**
		 * @public
		 */
		$el: null,
		$elements: null,
		options: {},
		timeline: null,


		/**
		 * Constructor
		 * @private
		 */
		_construct: function() {
			log.call(this, "Spirit constructed");

			// cache children
			this.$elements = this.$el.find(this.options.childSelector);

			this.initialize();

			if (this.jsonData) {
				this.parseJSON(this.jsonData);
			}
		},

		_validateOptions: function() {
			// validate tweenengine
			if (!_.isFunction(this.options.tweenEngine.tween) || !_.isFunction(this.options.tweenEngine.timeline)) {
				throw ns.Timeline.errorMessages.invalidTweeningEngines;
			}
		},

		/**
		 * Initialize
		 * Invoked by constructor, can be overridden for your needs
		 * @public
		 */
		initialize: function() {
			log.call(this, "initialized with options: ", this.options);
		},

		/**
		 * Preconstruct timeline
		 * Can be overridden to apply custom candy before the timeline gets constructed
		 * @param timeline
		 */
		preConstructTimeline: function(timeline) {
			log.call(this, "preconstruct Timeline");
			return timeline;
		},

		/**
		 * Construct the main timeline
		 */
		constructTimeline: function() {
		},


		/**
		 * Update timeline
		 * @param frame {Number} pixels
		 * @returns {*}
		 */
		update: function(frame) {
			log.call(this, 'update:', frame);

			// do timeline update logic
			return frame;
		},


		/**
		 * Extract JSON
		 * @returns {{}}
		 */
		toJSON: function() {
			return {};
		},

		/**
		 * Parse JSON
		 */
		parseJSON: function(json) {
			this._json = json;
			// parse json here
			log.call(this, 'parseJSON', json);
		},

		/**
		 * Kill THE SPIRIT
		 */
		kill: function() {
		}
	};


	/**
	 * Extend with debugging sugar
	 */
	_.extend(ns.Timeline.prototype, {

		_debug: false,

		forceDebug: function(debuggable) {
			this._debug = debuggable;
		},

		isDebug: function() {
			return this._debug;
		}
	});


	/**
	 * Extend with events
	 */
	_.extend(ns.Timeline.prototype, {
		on: function() {},
		off: function() {},
		trigger: function() {}
	});


	/**
	 * Extend with build in helpers
	 * For example: bind timeline to scroll!
	 */
	_.extend(ns.Timeline.prototype, {
//		bindToScroll: function(scrollContainer){}
	});


	/**
	 * Statics
	 */
	_.extend(ns.Timeline, {
		errorMessages: {
			noContainerElementFound: 'Spirit: no container element found! Make sure you provide a container element',
			invalidTweeningEngines: 'Spirit: no Tween[Lite/Max] or Timeline[Lite/Max] found. ' +
				'Both are required in order to use Spirit'
		}
	});


})(use('spirit'));
