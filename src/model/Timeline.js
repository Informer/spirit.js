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
    initialize: function(){
      _.autoBind(this);

      if (this.get('el') instanceof $) {
        this.bindModelToElement();
      }else{
        var selector = '[data-spirit-id=' + this.get('id') + ']',
            $el = $(selector);

        if ($el.length > 0) {
          this.set({el: $($el.get(0))}, {silent: true});
          this.bindModelToElement();
        }else{
          throw new Error('[spirit.model.Timeline] Can\'t apply timeline on element. Element: ' + selector + ' can\'t be found');
        }
      }
      return this;
    },

    /**
     * Bind this model to element
     * Retrieve this model by DOM element: $(..).data('spirit-model');
     * @returns {ns.Timeline}
     */
    bindModelToElement: function(){
      this.get('el').data('spirit-model', this);
      return this;
    },

    destroy: function(){
      if (this.get('el')) {
        this.get('el').data('spirit-model', null);
      }
      this._super();
    }

	});

})(use('spirit.model'));
