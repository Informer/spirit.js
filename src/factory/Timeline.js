(function(ns) {

  'use strict';

  /**
   * Construct a GSAP timeline
   * @param $el element to apply on
   * @param transitions spirit.collection.Transitions
   * @returns {Timeline(Lite/Max)}
   */
  ns.Timeline = function Timeline($el, transitions){
    var timeline = new globalDefaults.timeline({ useFrames: true, paused: true }),
        mappings = transitions.mappings;

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
        timeline.add(globalDefaults.tween.to($el, frame, params), prevFrame);
      }

    }, this);

    return timeline;
  };

})(use('spirit.factory'));
