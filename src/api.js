(function(ns) {

  'use strict';

  var groups = new (use('spirit.collection').Groups)();

  ns.groups = {
    add: function(models, options){
      return groups.add(models, options);
    },
    get: function(name){
      var found = groups.where({name: name});
      if (found.length > 0) {
        return found[0];
      }
      return null;
    },
    length: function(){
      return groups.length;
    }
  };

})(use('spirit'));
