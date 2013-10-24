/**
 * Created by pbrouwer on 23-10-13.
 */


$(function() {
	'use strict';

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


	var Timeline = spirit.Timeline.extend({

		jsonData: jsonData,

		initialize: function() {
			console.log('initialized timeline');
		}
	});


	var tl = new Timeline($('#container'));

});


