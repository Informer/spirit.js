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


	/**
	 * Check if namespace exists
	 * @param {string} namespace
	 * @returns {boolean}
	 */
	global.exist = function(namespace) {
		var segments = namespace.split('.');
		var doesExist = true;

		for (var i = 0, len = segments.length, obj = window; i < len; ++i) {
			var segment = segments[i];

			if (!obj[segment]) {
				doesExist = false;
				break;
			}
			obj = obj[segment];
		}

		return doesExist;
	};

})(window);;(function(ns) {

	'use strict';


	var ctor = function() {};
	var lookupIterator = function(value) { return ns.isFunction(value) ? value : function(obj) { return obj[value]; }; };


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
	 * Is a given value an array? Delegates to ECMA5's native Array.isArray
	 * @type {Function}
	 */
	ns.isArray = Array.isArray || function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
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
	 * Borrowed from underscorejs
	 * Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	 */
	ns.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
		ns['is' + name] = function(obj) {
			return Object.prototype.toString.call(obj) === '[object ' + name + ']';
		};
	});

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

	/**
	 * Borrowed from underscorejs
	 * Create a (shallow-cloned) duplicate of an object.
	 * @param obj
	 * @returns {*}
	 */
	ns.clone = function(obj) {
		if (typeof obj !== 'object') {
			return obj;
		}
		return ns.isArray(obj) ? obj.slice() : ns.extend({}, obj);
	};

	/**
	 * Borrowed from underscorejs
	 * Use a comparator function to figure out the smallest index at which an object should be inserted so as to maintain order. Uses binary search.
	 * @param array
	 * @param obj
	 * @param iterator
	 * @param context
	 * @returns {number}
	 */
	ns.sortedIndex = function(array, obj, iterator, context) {
		/* jshint -W016 */
		/* jshint -W030 */
		/* jshint -W116 */
		iterator = iterator === null ? ns.identity : lookupIterator(iterator);
		var value = iterator.call(context, obj);
		var low = 0, high = array.length;
		while (low < high) {
			var mid = (low + high) >>> 1;
			iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
		}
		return low;
	};

	/**
	 * Borrowed from underscorejs
	 * Return the position of the first occurrence of an item in an array, or -1 if the item is not included in the array.
	 * @param array
	 * @param item
	 * @param isSorted
	 * @returns {int}
	 */
	ns.indexOf = function(array, item, isSorted) {
		/* jshint -W116 */
		if (array === null) {
			return -1;
		}
		var i = 0, length = array.length;
		if (isSorted) {
			if (typeof isSorted == 'number') {
				i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
			} else {
				i = ns.sortedIndex(array, item);
				return array[i] === item ? i : -1;
			}
		}
		if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) {
			return array.indexOf(item, isSorted);
		}
		for (; i < length; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	};


	/**
	 * Autobind all methods to scope!
	 * @param scope
	 */
	ns.autoBind = function(scope) {
		var funcs = ns.functions(scope.constructor.prototype);
		ns.each(funcs, function(f) {
			if (f.charAt(0) !== '_' && ns.indexOf(['autoBind', 'constructor'], f) === -1) {
				scope[f] = ns.bind(scope[f], scope);
			}
		});
	};

	/**
	 * Check if we are running is test modus?
	 * @returns {boolean}
	 */
	ns.testMode = function() {
		/* jshint -W106 */
		return !!(window.__karma__);
	};

})(use('spirit._helpers'));;(function(ns) {
	'use strict';

	var _ = use('spirit._helpers');


	// Regular expression used to split event strings.
	var eventSplitter = /\s+/;

	// Implement fancy features of the Events API such as multiple event
	// names `"change blur"` and jQuery-style event maps `{change: action}`
	// in terms of the existing API.
	var eventsApi = function(obj, action, name, rest) {

		if (!name) {
			return true;
		}

		// Handle event maps.
		if (typeof name === 'object') {
			for (var key in name) {
				obj[action].apply(obj, [key, name[key]].concat(rest));
			}
			return false;
		}

		// Handle space separated event names.
		if (eventSplitter.test(name)) {
			var names = name.split(eventSplitter);
			for (var i = 0, l = names.length; i < l; i++) {
				obj[action].apply(obj, [names[i]].concat(rest));
			}
			return false;
		}

		return true;
	};

	// A difficult-to-believe, but optimized internal dispatch function for
	// triggering events. Tries to keep the usual cases speedy (most internal
	// Backbone events have 3 arguments).
	var triggerEvents = function(events, args) {
		/* jshint -W116 */

		var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
		switch (args.length) {
			case 0:
				while (++i < l) {
					(ev = events[i]).callback.call(ev.ctx);
				}
				return;
			case 1:
				while (++i < l) {
					(ev = events[i]).callback.call(ev.ctx, a1);
				}
				return;
			case 2:
				while (++i < l) {
					(ev = events[i]).callback.call(ev.ctx, a1, a2);
				}
				return;
			case 3:
				while (++i < l) {
					(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
				}
				return;
			default:
				while (++i < l) {
					(ev = events[i]).callback.apply(ev.ctx, args);
				}
		}
	};


	/**
	 * Event Dispatcher borrowed from backbonejs
	 * @type {{on: Function, once: Function, off: Function, trigger: Function, stopListening: Function}}
	 */
	ns.Events = {

		/* jshint -W030 */
		/* jshint -W084 */


		// Bind an event to a `callback` function. Passing `"all"` will bind
		// the callback to all events fired.
		on: function(name, callback, context) {
			if (!eventsApi(this, 'on', name, [callback, context]) || !callback) {
				return this;
			}
			this._events || (this._events = {});
			var events = this._events[name] || (this._events[name] = []);
			events.push({callback: callback, context: context, ctx: context || this});
			return this;
		},

		// Bind an event to only be triggered a single time. After the first time
		// the callback is invoked, it will be removed.
		once: function(name, callback, context) {
			if (!eventsApi(this, 'once', name, [callback, context]) || !callback) {
				return this;
			}
			var self = this;
			var once = _.once(function() {
				self.off(name, once);
				callback.apply(this, arguments);
			});
			once._callback = callback;
			return this.on(name, once, context);
		},

		// Remove one or many callbacks. If `context` is null, removes all
		// callbacks with that function. If `callback` is null, removes all
		// callbacks for the event. If `name` is null, removes all bound
		// callbacks for all events.
		off: function(name, callback, context) {
			var retain, ev, events, names, i, l, j, k;
			if (!this._events || !eventsApi(this, 'off', name, [callback, context])) {
				return this;
			}
			if (!name && !callback && !context) {
				this._events = {};
				return this;
			}
			names = name ? [name] : _.keys(this._events);
			for (i = 0, l = names.length; i < l; i++) {
				name = names[i];
				if (events = this._events[name]) {
					this._events[name] = retain = [];
					if (callback || context) {
						for (j = 0, k = events.length; j < k; j++) {
							ev = events[j];
							if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
								(context && context !== ev.context)) {
								retain.push(ev);
							}
						}
					}
					if (!retain.length) {
						delete this._events[name];
					}
				}
			}

			return this;
		},

		// Trigger one or many events, firing all bound callbacks. Callbacks are
		// passed the same arguments as `trigger` is, apart from the event name
		// (unless you're listening on `"all"`, which will cause your callback to
		// receive the true name of the event as the first argument).
		trigger: function(name) {
			if (!this._events) {
				return this;
			}
			var args = [].slice.call(arguments, 1);
			if (!eventsApi(this, 'trigger', name, args)) {
				return this;
			}
			var events = this._events[name];
			var allEvents = this._events.all;
			if (events) {
				triggerEvents(events, args);
			}
			if (allEvents) {
				triggerEvents(allEvents, arguments);
			}
			return this;
		},

		// Tell this object to stop listening to either specific events ... or
		// to every object it's currently listening to.
		stopListening: function(obj, name, callback) {
			var listeningTo = this._listeningTo;
			if (!listeningTo) {
				return this;
			}
			var remove = !name && !callback;
			if (!callback && typeof name === 'object') {
				callback = this;
			}
			if (obj) {
				(listeningTo = {})[obj._listenId] = obj;
			}
			for (var id in listeningTo) {
				obj = listeningTo[id];
				obj.off(name, callback, this);
				if (remove || _.isEmpty(obj._events)) {
					delete this._listeningTo[id];
				}
			}
			return this;
		}

	};

})(use('spirit.event'));
;(function(ns) {

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
;(function(ns) {

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
			transitions: 'spirit.collection.TransitionCollection'
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
//	var _ = use('spirit._helpers');


	ns.TransitionModel = ns.AbstractModel.extend({

		defaults: {
			params: null,
			ease: 'Linear.easeNone'
		},

		initialize: function() {

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


	ns.AbstractCollection = function(models) {
		this._construct(models);
	};

	ns.AbstractCollection.extend = _.extendObjectWithSuper;
	_.extend(ns.AbstractCollection.prototype, use('spirit.event').Events, {

		_byId: {},

		model: null,
		length: 0,
		models: [],
		comparator: false,

		_construct: function(models) {
			_.autoBind(this);

			this.model = exist(this.model) ? use(this.model) : use('spirit.model').AbstractModel;
			this.reset(models);
			this.initialize();
		},

		_removeReference: function(model) {
			if (this === model.collection) {
				delete model.collection;
			}
			model.off('all', this._onModelEvent, this);
		},

		_prepareModel: function(attrs, options) {
			if (attrs instanceof use('spirit.model').AbstractModel) {
				if (!attrs.collection) {
					attrs.collection = this;
				}
				return attrs;
			}
			options = options ? _.clone(options) : {};
			options.collection = this;
			var model = new this.model(attrs, options);
			if (!model.validationError) {
				return model;
			}
			this.trigger('invalid', this, model.validationError, options);
			return false;
		},

		initialize: function() {
			return this;
		},

		reset: function(models, options) {
			/* jshint -W030 */

			// remove references of each model
			_.each(this.models, function(m) {
				this._removeReference(m);
			}, this);

			// reset vars
			this.length = 0;
			this.models = [];
			options || (options = {});

			// add models
			models = this.add(models, _.extend({silent: true}, options));
			if (!options.silent) {
				this.trigger('reset', this, options);
			}
			return models;
		},

		// Add a model, or list of models to the set.
		add: function(models, options) {
			return this.set(models, _.extend({merge: false}, options, {add: true, remove: false}));
		},

		get: function(obj) {
			if (obj === null) {
				return void 0;
			}
			return this._byId[obj.id] || this._byId[obj];
		},

		set: function(models, options) {
			/* jshint -W116 */
			/* jshint -W084 */
			/* jshint -W055 */

			options = _.extend({}, options, {add: true, remove: true, merge: true});

			var singular = !_.isArray(models);

			models = singular ? (models ? [models] : []) : _.clone(models);


			var i, l, id, model, attrs, existing, sort;
			var at = options.at;
			var targetModel = this.model;
			var sortable = this.comparator && (at == null) && options.sort !== false;
			var sortAttr = _.isString(this.comparator) ? this.comparator : null;

			var toAdd = [],
				toRemove = [],
				modelMap = {};

			var add = options.add, merge = options.merge, remove = options.remove;
			var order = !sortable && add && remove ? [] : false;

			// Turn bare objects into model references, and prevent invalid models
			// from being added.
			for (i = 0, l = models.length; i < l; i++) {
				attrs = models[i];
				if (attrs instanceof use('spirit.model').AbstractModel) {
					id = model = attrs;
				} else {
					id = new targetModel(attrs);
				}

				// If a duplicate is found, prevent it from being added and
				// optionally merge it into the existing model.
				if (existing = this.get(id)) {
					if (remove) {
						modelMap[existing.cid] = true;
					}
					if (merge) {
						attrs = attrs === model ? model.attributes : attrs;
						if (options.parse) {
							attrs = existing.parse(attrs, options);
						}
						existing.set(attrs, options);
						if (sortable && !sort && existing.hasChanged(sortAttr)) {
							sort = true;
						}
					}
					models[i] = existing;

					// If this is a new, valid model, push it to the `toAdd` list.
				} else if (add) {
					model = models[i] = this._prepareModel(attrs, options);
					if (!model) {
						continue;
					}
					toAdd.push(model);

					// Listen to added models' events, and index models for lookup by
					// `id` and by `cid`.
					model.on('all', this._onModelEvent, this);
					this._byId[model.cid] = model;
					if (model.id != null) {
						this._byId[model.id] = model;
					}
				}
				if (order) {
					order.push(existing || model);
				}
			}

			// Remove nonexistent models if appropriate.
			if (remove) {
				for (i = 0, l = this.length; i < l; ++i) {
					if (!modelMap[(model = this.models[i]).cid]) {
						toRemove.push(model);
					}
				}
				if (toRemove.length) {
					this.remove(toRemove, options);
				}
			}

			// See if sorting is needed, update `length` and splice in new models.
			if (toAdd.length || (order && order.length)) {
				if (sortable) {
					sort = true;
				}
				this.length += toAdd.length;
				if (at != null) {
					for (i = 0, l = toAdd.length; i < l; i++) {
						this.models.splice(at + i, 0, toAdd[i]);
					}
				} else {
					if (order) {
						this.models.length = 0;
					}
					var orderedModels = order || toAdd;
					for (i = 0, l = orderedModels.length; i < l; i++) {
						this.models.push(orderedModels[i]);
					}
				}
			}

			// Silently sort the collection if appropriate.
			if (sort) {
				this.sort({silent: true});
			}

			// Unless silenced, it's time to fire all appropriate add/sort events.
			if (!options.silent) {
				for (i = 0, l = toAdd.length; i < l; i++) {
					(model = toAdd[i]).trigger('add', model, this, options);
				}
				if (sort || (order && order.length)) {
					this.trigger('sort', this, options);
				}
			}

			// Return the added (or merged) model (or models).
			return singular ? models[0] : models;
		},

		remove: function(models, options) {
			_.isFunction(models);
			_.isFunction(options);
		},

		toString: function() {
			return "[object AbstractCollection]";
		}

	});

	/**
	 * Mark as parseable
	 * In model.defaults {} we can provide class, while creating instance defaults will be set
	 * @type {boolean}
	 */
	ns.AbstractCollection.parseable = true;


})(use('spirit.collection'));;(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
//	var _ = use('spirit._helpers');


	ns.TransitionCollection = ns.AbstractCollection.extend({

		model: 'spirit.model.TransitionModel',

		initialize: function() {
			return this;

			// make sure each model has always a reference to it's previous one
//			this.on('add', this.updatePrevious);
//			this.on('remove', this.reapplyPrevious);
		}



	});


})(use('spirit.collection'));
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
		/* jshint -W106 */
		/* jshint -W116 */
		if (_.testMode()) {
			return false;
		}
		if (this._debug && window.console && _.isFunction(window.console.log)) {
			var args = [].slice.call(arguments);
			args.unshift('Spirit: ->');
			console.log.apply(console, args);
		}

		return true;
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
	_.extend(ns.Timeline.prototype, use('spirit.event').Events, {


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

	});


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
