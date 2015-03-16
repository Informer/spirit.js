(function() {

  'use strict';

  var _ = jasmine._helpers;

  describe('factory.Timeline', function() {

    var data,
        transitions;

    beforeEach(function() {
      data = _.loadFixture('transitions.json').transitions;
      transitions = new spirit.collection.Transitions(data);
    });

    it('should create a valid GSAP timeline', function() {
      var $el = $('<div/>'),
          timeline = new spirit.factory.Timeline($el, transitions);

      expect(timeline instanceof TimelineLite).toBeTruthy();
      expect(timeline.duration()).toBe(transitions.max(function(m){ return m.get('frame');}).get('frame'));

      // interpolate
      timeline.seek(100);

      expect(Math.floor($el.get(0)._gsTransform.x)).toBe(25);
      expect(Math.floor($el.get(0)._gsTransform.y)).toBe(0);
    });

    it ('should create a valid GSAP timeline with evaluated $this mapping', function(){

      var $el = $('<div style="width: 100px; height: 100px" data-spirit-id="element1" />'),
          model = new spirit.model.Timeline({el: $el, transitions: data});

      // add evaluated params
      model.get('transitions').add({
        frame: 300,
        params: [{ param: 'x', value: '{-($this.height()*2)}'}]
      });

      // create timeline and advance to 300 frames
      var timeline = new spirit.factory.Timeline(model.get('el'), model.get('transitions'));
      timeline.seek(300);

      expect($el.width()).toBe(100);
      expect($el.height()).toBe(100);
      expect($el.get(0)._gsTransform.x).toBe(-200);
    });
    
  });

})();
