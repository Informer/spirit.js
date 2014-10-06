(function(ns) {

  'use strict';

  ns.Transition = ns.Abstract.extend({

    defaults: {
      frame: 0,
      params: 'spirit.collection.TransitionParams',
      ease: 'Linear.easeNone'
    },

    initialize: function(){
      _.autoBind(this);

      // apply bubbling events
      this.get('params').on('change', _.bind(function(e){
        this.trigger('change:params', e);
      }, this));
    }

  });

})(use('spirit.model'));
