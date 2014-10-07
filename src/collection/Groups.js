(function(ns) {

  'use strict';

  ns.Groups = ns.Abstract.extend({
    model: 'spirit.model.Group',

    /**
     * Export as valid json
     */
    toJSON: function(){
      var data = [];

      this.each(function(group){
        data.push({
          name: group.get('name'),
          timelines: group.get('timelines').toJSON()
        });
      });

      return data;
    }
  });

})(use('spirit.collection'));
