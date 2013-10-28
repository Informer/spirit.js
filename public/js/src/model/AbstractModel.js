(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	ns.AbstractModel = function(){

	};

	ns.AbstractModel.extend = _.extendObject;
	ns.AbstractModel.prototype = {

		defaults: {},
		initialize: function(){

		}

	};




})(use('spirit.models'));
