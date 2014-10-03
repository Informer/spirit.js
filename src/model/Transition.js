(function(ns) {

  'use strict';

  ns.Transition = ns.Abstract.extend({

    defaults: {
      frame: 0,
      params: 'spirit.collection.TransitionParams',
      ease: 'Linear.easeNone'
    }

  });

})(use('spirit.model'));
