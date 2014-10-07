(function(ns) {

  'use strict';

  ns.Timelines = ns.Abstract.extend({
    model: 'spirit.model.Timeline',

    /**
     * Export to valid JSON
     * @returns {Array}
     */
    toJSON: function(){
      var data = [];

      this.each(function(timeline){
        data.push({
          id: timeline.get('id'),
          transitions: timeline.get('transitions').toJSON()
        });
      });

      return data;
    }
  });

})(use('spirit.collection'));
