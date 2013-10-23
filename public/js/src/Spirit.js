(function(ns) {

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
		_tweenEngine: null,

		/**
		 * @public
		 */
		preConstructTimeline: null,
		$container: null,


		/**
		 * Constructor
		 * @private
		 */
		_construct: function() {

			// setup tween engines
			this._tweenEngine = {
				tween: _.isFunction(window.TweenMax) ? window.TweenMax : window.TweenLite,
				timeline: _.isFunction(window.TimelineMax) ? window.TimelineMax : window.TimelineLite
			};

			if (!this._tweenEngine.tween || !this._tweenEngine.timeline) {
				throw 'Spirit: no Tween[Lite/Max] or Timeline[Lite/Max] found. ' +
					'Both are required in order to use Spirit';
			}

			this.initialize();
		},

		/**
		 * Initialize
		 * Invoked by constructor, can be overriden for your needs
		 * @public
		 */
		initialize: function() {},

		/**
		 * Turn debug on/off
		 * @param {boolean} debuggable
		 */
		debug: function(debuggable) {
			this._debug = debuggable;
			// debug logic
		},

		/**
		 * Get debug modus
		 * @returns {boolean}
		 */
		isDebug: function() {
			return this._debug;
		},


		/**
		 * Update timeline
		 * @param frame {Number} pixels
		 * @returns {*}
		 */
		update: function(frame) {
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
		parseJSON: function() {
			// parse json here
		},

		/**
		 * Kill THE SPIRIT
		 */
		dispose: function() {
		}
	};

	/**
	 * Extend Events
	 */
	_.extend(ns.Timeline.prototype, {

		on: function() {},
		off: function() {},
		trigger: function() {}

	});


})(use('spirit'));


