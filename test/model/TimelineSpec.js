(function() {

  'use strict';

  var _ = jasmine._helpers;

  describe('model.Timeline', function() {

    var jsonData = _.loadFixture('timeline.json').timelines[0];

    it('should have attached a timeline model to an $element', function() {
      var $el = $('<div data-spirit-id="element1">'),
          id = $el.data('spirit-id');

      var model = new spirit.model.Timeline({el: $el, id: id});
      expect(model.get('el')).toBe($el);
      expect(model.get('id')).toBe(id);
      expect($el.data('spirit-model')).toBe(model);
    });

    it('should parse fixture and set data to model', function() {
      var $el = $('<div data-spirit-id="' + jsonData.id + '">').appendTo('body'),
          model = new spirit.model.Timeline(jsonData);

      expect(model.get('el').get(0)).toBe($el.get(0));
      expect(model.get('el').data('spirit-model')).toBe(model);
      expect(model.get('transitions') instanceof spirit.collection.Transitions).toBeTruthy();

      var firstModel = model.get('transitions').at(0),
          firstData = jsonData.transitions[0];

      expect(firstModel.get('frame')).toBe(firstData.frame);
      expect(firstModel.get('ease')).toBe(firstData.ease);
      expect(firstModel.get('params') instanceof spirit.collection.TransitionParams).toBeTruthy();
      expect(firstModel.get('params').at(0).get('param')).toBe(firstData.params[0].param);
      expect(firstModel.get('params').at(0).get('value')).toBe(firstData.params[0].value);

      model.destroy();
      $el.remove();
    });

    it('should throw an error if "id" in json does not match any element', function() {
      expect(function() {
        new spirit.model.Timeline(jsonData);
      }).toThrow('[spirit.model.Timeline] Can\'t apply timeline on element. Element: [data-spirit-id=' + jsonData.id + '] can\'t be found');
    });

    it('should apply mappings', function() {
      var $el = $('<div data-spirit-id="awesome-element">').appendTo('body'),
          id = $el.data('spirit-id'),
          model = new spirit.model.Timeline({el: $el, id: id}),
          transitions = model.get('transitions');

      expect(transitions.mappings).not.toEqual([]);
      expect(transitions.mappings.length).toBeGreaterThan(0);
      expect(transitions.mappings[0] instanceof spirit.model.vo.RegExpMapping).toBeTruthy();
      expect(transitions.mappings[0].map).toBe($el);

      model.destroy();
      $el.remove();

      expect(transitions.mappings).toEqual([]);
    });

    it ('should apply previous model to each model in transitions', function(){
      var $el = $('<div data-spirit-id="' + jsonData.id + '">').appendTo('body');
      var m;

      new spirit.model.Timeline(jsonData).get('transitions').each(function(transition, i){
        if (i > 0) {
          expect(transition.get('previousModel')).toBeDefined();
          expect(transition.get('previousModel')).toBe(m);
        }
        m = transition;
      });

      $el.remove();
    });


  });

})();
