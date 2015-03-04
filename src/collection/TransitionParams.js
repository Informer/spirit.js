(function(ns) {

	'use strict';

	ns.TransitionParams = ns.Abstract.extend({

		model: 'spirit.model.TransitionParam',

		/**
		 * Construct Tween GSAP parameters from current collection
		 * @param evaluationExpressions {Object} evaluation mapping
		 * @returns {Object}
		 */
		constructTweenObject: function(evaluationExpressions){
			var constructed = {};

			_.each(this.filter(function(param){ return param.get('param') !== null && param.get('value') !== null; }), function(param){
        switch(param.get('param')) {

          case 'rotateX': constructed.rotationX = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;
          case 'rotateY': constructed.rotationY = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;
          case 'rotateZ': constructed.rotationZ = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;

          case 'skewX': constructed.skewX = param.getValue(evaluationExpressions) + 'deg'; break;
          case 'skewY': constructed.skewY = param.getValue(evaluationExpressions) + 'deg'; break;

          default: constructed[param.get('param')] = param.getValue(evaluationExpressions);
        }
      });

      return constructed;
     },

     /**
     * Export to valid JSON
     * @returns {Array}
     */
    toJSON: function(){
      var data = [];

      this.each(function(param){
        data.push({
          param: param.get('param'),
          value: param.get('value')
        });
      });

      return data;
    }

	});

})(use('spirit.collection'));
