(function(ns) {

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
	 * Borrowed from underscorejs
	 * Create a function bound to a given object (assigning this, and arguments, optionally)
	 * @param fn {*}
	 * @param context {{}} scope
	 * @return {{}}
	 */
	var nativeBind = Function.prototype.bind, slice = Array.prototype.slice, ctor = function() {};
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
		if (obj == null) return result;
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

})(use('spirit._helpers'));