(function(ns) {

	'use strict';


	/**
	 * Get helpers
	 * @type {*}
	 */
	var _ = use('spirit.helpers');


	/**
	 * Timeline
	 * @constructor
	 */
	ns.Timeline = function() {
		this.initialize();
	};

	ns.Timeline.prototype = {


		/**
		 * @private
		 */
		_debug: false,
		_timeline: null,

		/**
		 * @public
		 */
		preConstructTimeline: null,


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


