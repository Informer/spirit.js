(function() {
	'use strict';


	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers'),
		model = use('spirit.model'),
		collection = use('spirit.collection');


	var tweener = _.isFunction(window.TweenMax) ? window.TweenMax : window.TweenLite,
		getObjectFromString = function(str) {
			if (_.isUndefined(str) || !_.isString(str)) {
				return {};
			}
	
			var obj;
			try {
				var json = str.replace(/'|"/g, '').replace(/((?![\d]+|\.)[\w\.]+|(\+|-)?[\d]+(%|px|em|deg))/g, '"$1"');
				obj = $.parseJSON(json);
			} catch (e) {}
			return obj;
		};


	/**
	 * jQuery.spiritAnimateTo(state, speed, tweenOptions)
	 * jQuery.spiritAnimateTo(speed, tweenOptions)
	 */
	$.fn.spiritAnimateTo = function() {
		var args = [].slice.call(arguments),
			isState = function() {
				return _.isString(args[0]);
			},
			isDirect = function() {
				return _.isNumber(args[0]);
			};


		if (isState()) {
			return methods.animateToState.apply(this, [
				args[0],
				_.isNumber(args[1]) ? args[1] : defaults.speed,
				_.isObject(args[2]) ? args[2] : {}
			]);
		} else if (isDirect()) {
			return methods.animateTo.apply(this, [
				args[0],
				_.isObject(args[1]) ? args[1] : {}
			]);
		} else {
			$.error('invalid function parameters provided for jQuery.spiritAnimateTo. ' +
				'First param needs to be a state (string) or speed (number)');
		}
	};


	var defaults = {
		speed: 1
	};


	var methods = {

		animateToState: function(state, speed, options) {
			return this.each(function() {
				
				var $this = $(this),
					states = $this.data('spirit-states');

				// parse states
				if (_.isString(states)) {
					var coll = new collection.StatesCollection();

					_.each(getObjectFromString(states), function(val, key) {
						coll.add({
							name: key,
							tweenObj: val
						}, {silent: true});
					});

					$this.data('spirit-states', coll);
					states = coll;
				}

				if (!(states instanceof collection.StatesCollection)) {
					$this.trigger('spirit_error', {msg: 'jQuery.spiritAnimateTo: State[' + state + '] not found on element'});
				} else {

					var found = states.where({name: state});
					if (found.length === 0) {
						$this.trigger('spirit_error', {msg: 'jQuery.spiritAnimateTo: State[' + state + '] not found on element'});
						return;
					}

					// we found state.. animate it!
					var tweenObj = _.first(found).get('tweenObj');
					if (_.isObject(tweenObj)) {
						methods.animateTo.apply(this, [speed, _.extend(tweenObj, options)]);
					}
				}

			});
		},

		animateTo: function(speed, tweenObj) {
			var animateSingleElement = function() {
				var $this = $(this);
				if (tweener) {
					tweener.to($this, speed, tweenObj);
				}
			};
			return (this instanceof HTMLElement) ? animateSingleElement.call(this) : this.each(animateSingleElement);
		}

	};





})();