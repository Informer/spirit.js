(function() {
  'use strict';

  /**
   * Imports
   * @type {Object}
   */
  var model = use('spirit.model'),
  collection = use('spirit.collection');

  /**
   * Get tween engine (TweenLite|TweenMax)
   * @type {Function|Object}
   */
  var tweener = globalDefaults.tween;

  /**
   * Parse string to object conform GSAP properties
   * @param str {String}
   * @returns {Object}
   */
  var getObjectFromString = function(str) {
    var obj = {};
    try {
      var json = str.replace(/'|"/g, '').replace(/((?![\d]+|\.)[#\w\.]+|(\+|-)?[\d]+(%|px|em|deg))/g, '"$1"');
      obj = $.parseJSON(json);
    } catch (e) {}

    return obj;
  };

  /**
   * Animate to state
   *
   * jQuery.spiritAnimateTo(state, speed, tweenOptions)
   * jQuery.spiritAnimateTo(speed, tweenOptions)
   *
   * @see examples/states
   * @return {jQuery}
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

  /**
   * Default config
   * @type {Object}
   */
  var defaults = {
    speed: 1
  };

  /**
   * Methods to execute
   * @type {Object}
   */
  var methods = {

    /**
     * Animate to a state
     * @param state {String} Name of state
     * @param speed {Number} Time of animation (seconds)
     * @param options {Object} Override GSAP properties
     * @returns {jQuery} Current jQuery (collection) of execution
     */
    animateToState: function(state, speed, options) {
      return this.each(function() {

        var $this = $(this),
            states = $this.data('spirit-states');

        // parse states
        if (_.isString(states)) {
          var coll = new collection.States(),
              stateObj = getObjectFromString(states);

          if (_.size(stateObj) === 0) {
            $this.trigger('spirit_error', {msg: 'jQuery.spiritAnimateTo: could not parse states: ' + states });
            return;
          }

          _.each(stateObj, function(val, key) {
            coll.add({
              name: key,
              tweenObj: val
            }, {silent: true});
          });

          $this.data('spirit-states', coll);
          states = coll;
        }

        if (!(states instanceof collection.States)) {
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

    /**
     * Execute animation
     * @param speed {Number} Time of animation
     * @param tweenObj {Object} GSAP properties
     * @returns {HTMLElement|jQuery}
     */
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
