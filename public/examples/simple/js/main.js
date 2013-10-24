/**
 * Created by pbrouwer on 23-10-13.
 */


$(function() {
	'use strict';


	/**
	 * JSON FIXTURE
	 * @type {{}}
	 */
	var jsonData = {
		"elements": [
			{
				"id": "menu",
				"transitions": [
					{
						"frame": 0,
						"ease": "Linear.easeNone",
						"params": [
							{ "param": "translateX", "value": -50 },
							{ "param": "translateY", "value": -400 }
						]
					},
					{
						"frame": 200,
						"ease": "Cubic.easeOut",
						"params": [
							{ "param": "translateX", "value": 100 },
							{ "param": "translateY", "value": 400 }
						]
					}
				]
			}
		]
	};


	/**
	 * Extending Spirit
	 * @type {{}}
	 */
	var Timeline = spirit.Timeline.extend({
		jsonData: jsonData,
		initialize: function() {
			this._super();
		}
	});


	var tl = new Timeline($('#container'), {

		/**
		 * Force tweening engine
		 * @optional
		 */
		tweenEngine: {
			tween: window.TweenLite,
			timeline: window.TimelineLite
		},

		/**
		 * Define child selector
		 * @optional By default all items are animatable
		 */
		childSelector: '[data-animatable]',

		/**
		 * Let's force debug
		 * @optional
		 * Normally you won't need this. Spirit gets into debug mode automatically if debug JS is found
		 * This will force debugging!
		 */
		forceDebug: true

	});


	// setup slider
	var sliderOptions = {formater: function(value) { return 'Frame: ' + value; }};
	$('#slider').slider(sliderOptions).on('slide', function(evt) {

		// on slide, update timeline
		tl.update(evt.value);
	});

});


