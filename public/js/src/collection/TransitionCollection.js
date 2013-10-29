(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
//	var _ = use('spirit._helpers');


	ns.TransitionCollection = ns.AbstractCollection.extend({

		model: 123, //use('spirit.model').TransitionModel,

		initialize: function() {
			return this;

//			this.autoBind();

			// make sure each model has always a reference to it's previous one
//			this.on('add', this.updatePrevious);
//			this.on('remove', this.reapplyPrevious);
		}


	});


})(use('spirit.collection'));
