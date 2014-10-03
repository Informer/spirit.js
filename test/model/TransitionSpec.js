(function() {

  'use strict';

  var _ = jasmine._helpers;

  describe('model.Transition', function() {

    var transition;

    beforeEach(function() {
      transition = new spirit.model.Transition();
    });

    afterEach(function() {
      transition.off();
    });

    it('should have an empty transition by default', function() {
      expect(transition.get('frame')).toBe(0);
      expect(transition.get('params') instanceof spirit.collection.TransitionParams).toBeTruthy();
      expect(transition.get('params').length).toBe(0);
      expect(transition.get('ease')).toBe('Linear.easeNone');
    });

    it('should update the transition', function() {
      var responder = { event: function() {} };

      spyOn(responder, 'event').andCallThrough();
      transition.on('change', responder.event);
      transition.set({ frame: 100 });
      transition.set({
        frame: 12,
        ease: 'Linear.easeOut',
        params: [
          { "param": "top", "value": 0 }
        ]
      });

      expect(responder.event).toHaveBeenCalled();
      expect(responder.event.calls.length).toBe(2);

      var firstParam = transition.get('params').at(0);
      expect(firstParam instanceof spirit.model.TransitionParam).toBeTruthy();
      expect(firstParam.get('param')).toBe('top');
      expect(firstParam.get('value')).toBe(0);
    });

  });

})();
