(function(ns) {

  'use strict';

  /**
   * Transition Parameter Model
   * Data Object containing a CSS parameter and it's value
   * When value is wrapper between { } then it's considered as an evaluated value
   */
  ns.TransitionParam = ns.Abstract.extend({

    defaults: {
      param: null,
      value: null
    },

    /**
     * Check if current parameter is a CSS Transform
     * @returns {Boolean}
     */
    isCSSTransform: function() {
      var p = ns.TransitionParam.params,
          transforms = [
            p.translateX, p.translateY, p.translateZ,
            p.rotateX, p.rotateY, p.rotateZ,
            p.skewX, p.skewY,
            p.scaleX, p.scaleY
          ];

      return _.contains(transforms, this.get('param'));
    },

    /**
     * Check if current value is evaluable
     * What this means is that the current value does have a reference (js code),
     * that's get evaluated in time (JIT). Use getValue to retrieve the actual param value instead.
     * @returns {Boolean}
     */
    isEval: function() {
      /* jshint -W092 */
      return /\{(.*?)\}/.test(this.get('value'));
    },

    /**
     * Get the calculated value based on a (collection) mapping
     * @param mappings {{ expression, map}|[{ expression, map}]}
     * @returns {*}
     */
    getValue: function(mappings) {
      var v = this.get('value');

      if (this.isEval()) {

        if (mappings) {
          // store valid mappings
          var extractionObject = {};
          _.each(!_.isArray(mappings) ? [mappings] : mappings, function(mapping, i) {
            if (mapping.expression instanceof RegExp) {
              if (mapping.expression.global) {
                mapping.expression.lastIndex = 0;
              }

              if (mapping.expression.test(v)) {
                extractionObject[mapping.expression] = mapping;
              }
            }
          });

          // create the evaluated string out of it
          for (var i in extractionObject) {
            v = v.replace(extractionObject[i].expression, 'extractionObject[' + i + '].map');
          }
        }

        try {
          /* jshint -W061 */
          return eval(v);
        } catch (e) {}
      }

      return v;
    }

  });

  /**
   * List of all possible CSS params
   * @type {Object}
   */
  ns.TransitionParam.params = {
    autoAlpha: 'autoAlpha',
    translateX: 'translateX',
    translateY: 'translateY',
    translateZ: 'translateZ',

    rotateX: 'rotateX',
    rotateY: 'rotateY',
    rotateZ: 'rotateZ',

    skewX: 'skewX',
    skewY: 'skewY',

    scaleX: 'scaleX',
    scaleY: 'scaleY',

    opacity: 'opacity',

    transformOrigin: 'transformOrigin',
    perspective: 'perspective',

    backgroundPositionX: 'backgroundPositionX',
    backgroundPositionY: 'backgroundPositionY',

    width: 'width',
    height: 'height',

    color: 'color',
    backgroundColor: 'backgroundColor',

    paddingTop: 'paddingTop',
    paddingBottom: 'paddingBottom',
    paddingLeft: 'paddingLeft',
    paddingRight: 'paddingRight',

    marginTop: 'marginTop',
    marginBottom: 'marginBottom',
    marginLeft: 'marginLeft',
    marginRight: 'marginRight',

    fontSize: 'fontSize',

    borderWidth: 'borderWidth',
    borderColor: 'borderColor',

    borderTopWidth: 'borderTopWidth',
    borderBottomWidth: 'borderBottomWidth',
    borderLeftWidth: 'borderLeftWidth',
    borderRightWidth: 'borderRightWidth',

    borderTopColor: 'borderTopColor',
    borderBottomColor: 'borderBottomColor',
    borderLeftColor: 'borderLeftColor',
    borderRightColor: 'borderRightColor',

    borderTopLeftRadius: 'borderTopLeftRadius',
    borderTopRightRadius: 'borderTopRightRadius',
    borderBottomRightRadius: 'borderBottomRightRadius',
    borderBottomLeftRadius: 'borderBottomLeftRadius'
  };

})(use('spirit.model'));
