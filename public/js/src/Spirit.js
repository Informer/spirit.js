(function(ns) {

	'use strict';


	/**
	 * Get helpers
	 * @type {*}
	 */
	var _ = use('spirit.helpers');


	/**
	 *
	 * @param $container {HTMLElement} DOM element holding the animateable items
	 * @param options {{}} custom configuration
	 * @constructor
	 */
	ns.Timeline = function($container, options) {
		this.$container = $($container);
		_.extend(this._options, options || {});

		this.initialize();
	};


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
		 * Initialize Timeline..
		 * Invoked by constructor
		 */
		initialize: function() {
			// code
		},

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


