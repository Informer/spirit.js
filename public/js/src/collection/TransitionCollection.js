(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
//	var _ = use('spirit._helpers');


	ns.TransitionCollection = ns.AbstractCollection.extend({

		model: 'spirit.model.TransitionModel',

		initialize: function() {
			// make sure each model has always a reference to it's previous one
			this.on('add', this.added);
			this.on('remove', this.removed);
		},

		added: function() {
//			console.log('TransitionCollection -> added model');
		},

		removed: function(){
//			console.log('TransitionCollection -> removed model');
		}


	});


})(use('spirit.collection'));
