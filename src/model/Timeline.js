(function(ns) {

  'use strict';

  ns.Timeline = ns.Abstract.extend({

    defaults: {
      el: null,
      id: null,
      transitions: 'spirit.collection.Transitions'
    },

    /**
     * Initialize
     * This model can be constructed by json data or by assigning real values.
     * @returns {ns.Timeline}
     */
    initialize: function() {
      _.autoBind(this);

      if (this.get('el') instanceof $) {
        this.bindModelToElement();
        this.applyMappings();
      } else {
        var selector = '[data-spirit-id=' + this.get('id') + ']',
            $el = $(selector);

        if ($el.length > 0) {
          this.set({el: $($el.get(0))}, {silent: true});
          this.bindModelToElement();
          this.applyMappings();
        } else {
          throw new Error('[spirit.model.Timeline] Can\'t apply timeline on element. Element: ' + selector + ' can\'t be found');
        }
      }

      // update transitions linked list (previous models)
      this.get('transitions').updateAll();

      // apply bubbling events
      this.get('transitions').on('add remove change change:params add:params remove:params', _.bind(function(e){
        this.trigger('change:transitions', e);
      }, this));

      return this;
    },

    /**
     * Bind this model to element
     * Retrieve this model by DOM element: $(..).data('spirit-model');
     * @returns {ns.Timeline}
     */
    bindModelToElement: function() {
      this.get('el').data('spirit-model', this);
      return this;
    },

    /**
     * Apply mappings on transitions
     * @returns {ns.Timeline}
     */
    applyMappings: function() {
      this.get('transitions').mappings.push(
        new (use('spirit.model.vo').RegExpMapping)(
          /\$this/g,
          this.get('el')
        )
      );
    },

    destroy: function() {
      this.get('transitions').mappings = [];
      if (this.get('el')) {
        this.get('el').data('spirit-model', null);
      }
      this._super();
    }

  });

})(use('spirit.model'));
