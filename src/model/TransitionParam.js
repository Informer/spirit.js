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
      var transforms = [
            'x', 'y', 'z',
            'rotateX', 'rotateY', 'rotateZ',
            'skewX', 'skewY',
            'scaleX', 'scaleY', 'scale'
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

  var min = -999999999;
  var max = 999999999;

  /**
   * List of all possible CSS params
   * @type {Object}
   */
  ns.TransitionParam.params = {
    autoAlpha:                { type: 'number', min: 0, max: 1, step: 0.005, default: 1 },
    opacity:                  { type: 'number', min: 0, max: 1, step: 0.005 },

    x:                        { type: 'number', min: min, max: max, step: 1, default: 0 },
    y:                        { type: 'number', min: min, max: max, step: 1, default: 0 },
    z:                        { type: 'number', min: min, max: max, step: 1, default: 0 },

    rotateX:                  { type: 'number', min: min, max: max, step: 1, default: 0 },
    rotateY:                  { type: 'number', min: min, max: max, step: 1, default: 0 },
    rotateZ:                  { type: 'number', min: min, max: max, step: 1, default: 0 },

    skewX:                    { type: 'number', min: min, max: max, step: 1, default: 0 },
    skewY:                    { type: 'number', min: min, max: max, step: 1, default: 0 },

    scale:                    { type: 'number', min: min, max: max, step: 0.5, default: 1 },
    scaleX:                   { type: 'number', min: min, max: max, step: 0.5, default: 1 },
    scaleY:                   { type: 'number', min: min, max: max, step: 0.5, default: 1 },

    transformOrigin:          { type: 'string', default: '50% 50%' },
    perspective:              { type: 'number', min: min, max: max, step: 1, default: 400 },
    perspectiveOrigin:       { type: 'string', default: '50% 50%' },

    backgroundPositionX:      { type: 'number', min: min, max: max, step: 1, default: 0 },
    backgroundPositionY:      { type: 'number', min: min, max: max, step: 1, default: 0 },

    width:                    { type: 'number', min: min, max: max, step: 1, default: 0 },
    height:                   { type: 'number', min: min, max: max, step: 1, default: 0 },

    color:                    { type: 'string' },
    backgroundColor:          { type: 'string' },

    paddingTop:               { type: 'number', min: min, max: max, step: 1, default: 0 },
    paddingBottom:            { type: 'number', min: min, max: max, step: 1, default: 0 },
    paddingLeft:              { type: 'number', min: min, max: max, step: 1, default: 0 },
    paddingRight:             { type: 'number', min: min, max: max, step: 1, default: 0 },

    marginTop:                { type: 'number', min: min, max: max, step: 1, default: 0 },
    marginBottom:             { type: 'number', min: min, max: max, step: 1, default: 0 },
    marginLeft:               { type: 'number', min: min, max: max, step: 1, default: 0 },
    marginRight:              { type: 'number', min: min, max: max, step: 1, default: 0 },

    fontSize:                 { type: 'number', min: min, max: max, step: 1, default: 0 },

    borderWidth:              { type: 'number', min: min, max: max, step: 1, default: 0 },
    borderColor:              { type: 'string' },
    borderStyle:              { type: 'string', default: 'solid' },

    borderTopWidth:           { type: 'number', min: min, max: max, step: 1, default: 0 },
    borderBottomWidth:        { type: 'number', min: min, max: max, step: 1, default: 0 },
    borderLeftWidth:          { type: 'number', min: min, max: max, step: 1, default: 0 },
    borderRightWidth:         { type: 'number', min: min, max: max, step: 1, default: 0 },

    borderTopColor:           { type: 'string' },
    borderBottomColor:        { type: 'string' },
    borderLeftColor:          { type: 'string' },
    borderRightColor:         { type: 'string' },

    borderTopLeftRadius:      { type: 'number', min: min, max: max, step: 1, default: 0 },
    borderTopRightRadius:     { type: 'number', min: min, max: max, step: 1, default: 0 },
    borderBottomRightRadius:  { type: 'number', min: min, max: max, step: 1, default: 0 },
    borderBottomLeftRadius:   { type: 'number', min: min, max: max, step: 1, default: 0 },

    zIndex:                   { type: 'number', min: min, max: max, step: 1, default: 1 },
  };

})(use('spirit.model'));
