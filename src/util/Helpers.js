(function(ns) {

	'use strict';

	var ctor = function() {};

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
	 * Check if we are running in test mode?
	 * @returns {boolean}
	 */
	ns.testMode = function() {
		/* jshint -W106 */
		return !!(window.__karma__);
	};

  /**
  * RAF Polyfill
  * https://gist.github.com/paulirish/1579671
  */
  ns.raf = function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];

    var raf = window.requestAnimationFrame;

    for(var x = 0; x < vendors.length && !raf; ++x) {
      raf = window[vendors[x]+'RequestAnimationFrame'];
    }

    if (!raf) {
      return function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    return raf;
  };

})(use('spirit._helpers'));
