(function(ns) {

  'use strict';

  /**
   * Get default gsTransform object
   */
  var gsTransform = (function(){
    var div = document.createElement('div');
    new globalDefaults.tween(div, 0, {x: 0}).play();
    return div._gsTransform;
  })();


  /**
   * Construct a GSAP timeline
   * @param $el element to apply on
   * @param transitions spirit.collection.Transitions
   * @returns {Timeline(Lite/Max)}
   */
  ns.Timeline = function Timeline($el, transitions){
    var timeline = new globalDefaults.timeline({ useFrames: true, paused: true }),
        mappings = transitions.mappings,
        el = $el.get(0);

    // sanitize all gstransforms for element
    var allparams = {};
    transitions.each(function(transition){
      for (var i in transition.get('params').constructTweenObject(mappings)) {
        allparams[i] = true;
      }
    });
    for (var i in el._gsTransform) {
      if (!allparams.hasOwnProperty(i)) {
        el._gsTransform[i] = gsTransform[i];
      }
    }

    transitions.each(function(transition){

      var frame = transition.get('frame'),
          prevModel = transition.get('previousModel'),
          prevFrame = prevModel ? prevModel.get('frame') : 0,
          params = transition.get('params').constructTweenObject(mappings);

      params.ease = transition.get('ease');

      if (prevModel) {
        // shift in time when prevModel is available
        frame -= prevModel.get('frame');
      }

      if (!_.isEmpty(params)) {
        timeline.add(globalDefaults.tween.to($el, frame, params).play(), prevFrame);
      }

    }, this);

    return timeline;
  };

})(use('spirit.factory'));
