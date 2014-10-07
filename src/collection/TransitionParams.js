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

			var constructed = {},
				css = use('spirit.model').TransitionParam.params;

			_.each(this.filter(function(param){ return param.get('param') !== null && param.get('value') !== null; }), function(param){
				if (param.isCSSTransform()) {
					switch(param.get('param')) {
						case css.translateX: constructed.x = param.getValue(evaluationExpressions); break;
						case css.translateY: constructed.y = param.getValue(evaluationExpressions); break;
						case css.translateZ: constructed.z = param.getValue(evaluationExpressions); break;

						case css.rotateX: constructed.rotationX = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;
						case css.rotateY: constructed.rotationY = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;
						case css.rotateZ: constructed.rotationZ = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;

						case css.skewX: constructed.skewX = param.getValue(evaluationExpressions) + 'deg'; break;
						case css.skewY: constructed.skewY = param.getValue(evaluationExpressions) + 'deg'; break;

						case css.scaleX:  constructed.scaleX = param.getValue(evaluationExpressions); break;
						case css.scaleY:  constructed.scaleY = param.getValue(evaluationExpressions); break;
					}
				}else{
					constructed[param.get('param')] = param.getValue(evaluationExpressions);
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
