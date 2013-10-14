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
	ns.extend = Object.extend = Object.prototype.extend = function(obj) {
		ns.each(Array.prototype.slice.call(arguments, 1), function(source) {
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};


})(use('spirit.helpers'));