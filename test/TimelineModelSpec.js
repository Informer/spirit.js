(function() {

  'use strict';

  var _ = jasmine._helpers;
  var TimelineModel = spirit.model.TimelineModel;

  describe('TimelineModel', function() {

    it ('should have attached a timeline model to an $element', function(){
    	var $el = $('<div data-spirit-id="element1">'),
          id = $el.data('spirit-id');

      var model = new TimelineModel({el : $el, id: id});
      expect(model.get('el')).toBe($el);
      expect(model.get('id')).toBe(id);
      expect($el.data('spirit-model')).toBe(model);
    });

    it ('should parse fixture and set data to model', function(){
    	var jsonData = _.loadFixture('timeline.json').elements[0];

      var $el = $('<div data-spirit-id="' + jsonData.id + '">').appendTo('body');
      var model = new TimelineModel(jsonData);

      expect(model.get('el').get(0)).toBe($el.get(0));
      expect(model.get('el').data('spirit-model')).toBe(model);
      expect(model.get('transitions') instanceof spirit.collection.TransitionCollection).toBeTruthy();

      var firstModel = model.get('transitions').at(0);
      var firstData = jsonData.transitions[0];

      expect(firstModel.get('frame')).toBe(firstData.frame);
      expect(firstModel.get('ease')).toBe(firstData.ease);
      expect(firstModel.get('params') instanceof spirit.collection.TransitionParamCollection).toBeTruthy();
      expect(firstModel.get('params').at(0).get('param')).toBe(firstData.params[0].param);
      expect(firstModel.get('params').at(0).get('value')).toBe(firstData.params[0].value);

      model.destroy();
      $el.remove();
    });

  });

})();
