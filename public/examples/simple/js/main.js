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
			console.log('Timeline -> initialize', this.options);
			
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
		childSelector: '[data-animatable]'

	});

});


