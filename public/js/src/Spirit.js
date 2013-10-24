(function(ns) {

	'use strict';


	/**
	 * Get helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	/**
	 *
	 * @param $el {HTMLElement} DOM element containing the animateable children
	 * @param options {{}} custom configuration
	 * @constructor
	 */
	ns.Timeline = function($el, options) {
		// validate and determine $el
		if (arguments.length === 0 || !(_.some([Array, HTMLElement, $], function(type) { return $el instanceof type; }))) {
			throw 'Spirit: no container element found! Make sure you provide a container element';
		}
		this.$el = $($($el).get(0));

		// define options
		_.extend(this.options, {
			tweenEngine: {
				tween: _.isFunction(window.TweenMax) ? window.TweenMax : window.TweenLite,
				timeline: _.isFunction(window.TimelineMax) ? window.TimelineMax : window.TimelineLite
			},
			childSelector: '*'
		}, options || {});

		this._validateOptions();

		// construct Spirit
		this._construct();
	};

	ns.Timeline.extend = _.extendObject;
	ns.Timeline.prototype = {


		/**
		 * @private
		 */
		_debug: false,


		/**
		 * @public
		 */
		$container: null,
		options: {},
		timeline: null,


		/**
		 * Constructor
		 * @private
		 */
		_construct: function() {
			this.initialize();

			if (this.jsonData) {
				this.parseJSON(this.jsonData);
			}
		},

		_validateOptions: function() {
			// validate tweenengine
			if (!_.isFunction(this.options.tweenEngine.tween) || !_.isFunction(this.options.tweenEngine.timeline)) {
				throw 'Spirit: no Tween[Lite/Max] or Timeline[Lite/Max] found. ' +
					'Both are required in order to use Spirit';
			}
		},

		/**
		 * Initialize
		 * Invoked by constructor, can be overridden for your needs
		 * @public
		 */
		initialize: function() {},

		/**
		 * Preconstruct timeline
		 * Can be overridden to apply custom candy before the timeline gets constructed
		 * @param timeline
		 */
		preConstructTimeline: function(timeline){
			return timeline;
		},


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
		parseJSON: function(json) {
			// parse json here
			console.log('Timeline -> parseJSON', json);

		},

		/**
		 * Kill THE SPIRIT
		 */
		kill: function() {
		}
	};

	/**
	 * Extend Event Dispatcher
	 */
	_.extend(ns.Timeline.prototype, {

		on: function() {},
		off: function() {},
		trigger: function() {}

	});


})(use('spirit'));


