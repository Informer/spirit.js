(function() {
	'use strict';


	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers'),
		model = use('spirit.model');


	/**
	 * jQuery.spiritAnimateTo(state, speed, tweenOptions)
	 */
	$.fn.spiritAnimateTo = function() {

		// ensure we've statesModel data for each element
		methods.init.call(this);

		var args = [].slice.call(arguments),
			isState = function(){
				return args.length === 3 && _.isString(args[0]) && _.isNumber(args[1]) && _.isObject(args[2]);
			},
			isDirect = function(){
				return args.length === 2 && _.isNumber(args[0]) && _.isObject(args[1]);
			};

		if (isState()) {

		} else if (isDirect()) {

		} else {
			$.error('invalid function parameters provided for jQuery.spiritAnimateTo');
		}
	};


	var methods = {

		init: function() {
			return this.each(function() {
				var $this = $(this),
					spirit = $this.data('spirit-states');

				if (!spirit) {
					$this.data('spirit-states', new model.StatesModel());
				} else if (spirit && _.isString(spirit)) {
					$this.data('spirit-states', new model.StatesModel(spirit));
				}
			});
		},


		animateToState: function() {

		},

		animateTo: function() {

		}

	};


})();