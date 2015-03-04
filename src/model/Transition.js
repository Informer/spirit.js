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
      this.get('params').on('change', _.bind(function(e){ this.trigger('change:params', e); }, this));
      this.get('params').on('add',    _.bind(function(e){ this.trigger('add:params', e);    }, this));
      this.get('params').on('remove', _.bind(function(e){ this.trigger('remove:params', e); }, this));
    }

  });

})(use('spirit.model'));
