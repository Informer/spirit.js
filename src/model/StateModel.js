(function(ns) {

  'use strict';

  ns.StateModel = ns.AbstractModel.extend({

    defaults: {
      name: 'undefined',
      tweenObj: {}
    }

  });

})(use('spirit.model'));
