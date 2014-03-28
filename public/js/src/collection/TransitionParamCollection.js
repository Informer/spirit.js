(function(ns) {

	'use strict';

	ns.TransitionParamCollection = ns.AbstractCollection.extend({

		model: 'spirit.model.TransitionParamModel',


		/**
		 * Construct Tween GSAP parameters from current collection
		 * @param evaluationExpressions {Object} evaluation mapping
		 * @returns {Object}
		 */
		constructTweenObject: function(evaluationExpressions){

			var constructed = {},
				paramModel = use('spirit.model').TransitionParamModel.params,
				params = this.filter(function(param){
					return param.get('param') !== null && param.get('value') !== null;
				});

			_.each(params, function(param){
				if (param.isCSSTransform()) {
					switch(param.get('param')) {
						case paramModel.translateX: constructed.x = param.getValue(evaluationExpressions); break;
						case paramModel.translateY: constructed.y = param.getValue(evaluationExpressions); break;
						case paramModel.translateZ: constructed.z = param.getValue(evaluationExpressions); break;

						case paramModel.rotateX: constructed.rotationX = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;
						case paramModel.rotateY: constructed.rotationY = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;
						case paramModel.rotateZ: constructed.rotationZ = '+=' + param.getValue(evaluationExpressions) + 'deg'; break;

						case paramModel.skewX: constructed.skewX = param.getValue(evaluationExpressions) + 'deg'; break;
						case paramModel.skewY: constructed.skewY = param.getValue(evaluationExpressions) + 'deg'; break;

						case paramModel.scaleX:  constructed.scaleX = param.getValue(evaluationExpressions); break;
						case paramModel.scaleY:  constructed.scaleY = param.getValue(evaluationExpressions); break;
					}
				}else{
					constructed[param.get('param')] = param.getValue(evaluationExpressions);
				}
			});

			return constructed;
		}

	});

})(use('spirit.collection'));
