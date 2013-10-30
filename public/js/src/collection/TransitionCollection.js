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
			return this;

			// make sure each model has always a reference to it's previous one
//			this.on('add', this.updatePrevious);
//			this.on('remove', this.reapplyPrevious);
		}



	});


})(use('spirit.collection'));
