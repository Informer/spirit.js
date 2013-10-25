(function(ns) {

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
	var defaultOptions = function(){
		return {
			tweenEngine: {
				tween:    _.isFunction(window.TweenMax)    ? window.TweenMax    : window.TweenLite,
				timeline: _.isFunction(window.TimelineMax) ? window.TimelineMax : window.TimelineLite
			},
			childSelector: '*'
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
			throw 'Spirit: no container element found! Make sure you provide a container element';
		}
		this.$el = $($($el).get(0));

		// setup options
		this._validateOptions(_.extend(this.options, defaultOptions(), options || {}));

		// construct Spirit
		this._construct();
	};

	ns.Timeline.extend = _.extendObject;
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
			this._debug = !!(this.options.forceDebug);
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
				throw 'Spirit: no Tween[Lite/Max] or Timeline[Lite/Max] found. ' +
					'Both are required in order to use Spirit';
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


})(use('spirit'));
