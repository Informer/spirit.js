(function(ns) {

  'use strict';

  ns.Transitions = ns.Abstract.extend({

    model: 'spirit.model.Transition',

    /**
     * Regex mappings
     * Evaluated values are piped through these mappings first
     */
    mappings: [],
    comparator: 'frame',

    /**
     * Initialize Collection of model.Transition
     * @returns {ns.Transitions}
     */
    initialize: function() {
      _.autoBind(this);
      this.mappings = [];

      // make sure each model has always a reference to it's previous one
      this.on('reset add remove', this.updateAll);
      return this;
    },

    /**
     * Update a single model with previousModel
     * @param m
     * @param coll
     * @param options
     * @returns {ns.Transitions}
     */
    updateModel: function(m, coll, options) {
      var index = this.indexOf(m),
          modelAbove;

      if (index > 0) {
        modelAbove = this.at(index - 1);
      }
      m.set({previousModel: modelAbove});
      return this;
    },

    /**
     * Update all models with previousModel
     * @param m
     * @param coll
     * @param options
     * @returns {ns.Transitions}
     */
    updateAll: function() {
      return this.each(this.updateModel);
    },

    /**
     * Export to valid JSON
     * @returns {Array}
     */
    toJSON: function(){
      var data = [];

      this.each(function(transition){
        data.push({
          frame: transition.get('frame'),
          ease: transition.get('ease'),
          params: transition.get('params').toJSON()
        });
      });

      return data;
    }

  });

})(use('spirit.collection'));
