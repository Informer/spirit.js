(function(ns) {

  'use strict';

  /**
   * Use a collection.Groups internally
   * @private
   */
  var groups = new (use('spirit.collection').Groups)();
  groups.on('add remove reset', function(){
    ns.groups.length = groups.length;
  });

  /**
   * Expose some internals used by the extension
   * @type {Object}
   * @private
   */
  ns.__internals__ = {
    params: use('spirit.model').TransitionParam.params
  };

  /**
   * Groups API
   * @public
   * @type {Object}
   */
  ns.groups = {

    /**
     * Extension needs direct access to collection
     * @type {Object}
     * @private
     */
    __internals__: groups,

    /**
     * Number of groups
     */
    length: 0,

    /**
     * Add groups to spirit
     * @param models {Array|Object}
     * @param options (optional)
     * @returns added models {Array}
     */
    add: function(models, options){
      return groups.add(models, options);
    },

    /**
     * Get group by name
     * @param name
     * @returns {model.Group}
     */
    get: function(name){
      var found = groups.where({name: name});
      if (found.length > 0) {
        return found[0];
      }
      return null;
    },

    /**
     * Get group by index
     * @param index
     * @returns {model.Group}
     */
    at: function(index){
      return groups.at(index);
    }
  };

  /**
   * Load spirit groups
   * @param json
   * @returns {Array}
   */
  ns.load = function(json){
    return groups.reset(json);
  };

  /**
   * Reset spirit, remove all groups
   * @returns {Array}
   */
  ns.reset = function(){
    return groups.reset();
  };

  /**
   * Export all groups
   * @returns {Object} json
   */
  ns.toJSON = function(){
    return groups.toJSON();
  };

})(use('spirit', true));
