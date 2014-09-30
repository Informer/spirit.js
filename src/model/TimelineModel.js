(function(ns) {

	'use strict';


	ns.TimelineModel = ns.AbstractModel.extend({

		defaults: {
			el: null,
			id: null,
			transitions: 'spirit.collection.TransitionCollection'
		}

	});


})(use('spirit.model'));
