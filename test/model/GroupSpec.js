(function() {

  'use strict';

  var _ = jasmine._helpers;

  describe('model.Group', function() {

    var puppet;
    var data;
    var group;

    var transformObj = function($el){ return $el.get(0)._gsTransform; };
    var cssProp = function($el, css){ return window.getComputedStyle($el.get(0), null).getPropertyValue(css); };

    beforeEach(function() {
      puppet = {};
      puppet.$head = $('<div data-spirit-id="puppet-head">HEAD</div>').appendTo('body');
      puppet.$body = $('<div data-spirit-id="puppet-body">BODY</div>').appendTo('body');
      puppet.$handLeft = $('<div data-spirit-id="puppet-hand-left">HAND LEFT</div>').appendTo('body');
      puppet.$handRight = $('<div data-spirit-id="puppet-hand-right">HAND RIGHT</div>').appendTo('body');

      data = _.loadFixture('groups.json').groups[0];
      group = new spirit.model.Group(data);
    });

    afterEach(function(){
      for (var i in puppet) {
        puppet[i].remove();
      }
    });

    it('should have 4 child timelines', function() {
      var timelines = group.get('timelines');
      expect(timelines instanceof spirit.collection.Timelines).toBeTruthy();
      expect(timelines.length).toBe(4);
      expect(group.get('name')).toBe(data.name);
    });

    it ('should have a constructed timeline', function(){
    	expect(group.timeline instanceof TimelineLite).toBeTruthy();
      expect(group.timeline.duration()).toBe(550);

      group.timeline.seek(50);
      expect(transformObj(puppet.$head).x).toBe(362.50);
      expect(transformObj(puppet.$head).y).toBe(125);

      group.timeline.seek(250);
      expect(parseFloat(cssProp(puppet.$body, 'opacity')).toFixed(2)).toBe('0.58');

      group.timeline.seek(350);
      expect(transformObj(puppet.$handLeft).rotation.toFixed(2)).toBe('6.23');
      expect(transformObj(puppet.$handRight).rotation.toFixed(2)).toBe('-6.23');
    });

    it ('should have a unique timeline (not shared)', function(){
    	var groupA = new spirit.model.Group({name: 'A'});
      var groupB = new spirit.model.Group({name: 'B'});

      expect(groupA.timeline).not.toBe(groupB.timeline);
    });

    it ('should call kill and clear on timeline when reconstructed', function(){
    	spyOn(group.timeline, 'kill').andCallThrough();
    	spyOn(group.timeline, 'clear').andCallThrough();

      group.constructTimeline();

      expect(group.timeline.kill).toHaveBeenCalled();
      expect(group.timeline.kill.callCount).toBe(1);

      expect(group.timeline.clear).toHaveBeenCalled();
      expect(group.timeline.clear.callCount).toBe(1);
    });

    describe('constructTimeline', function(){

      var transitions;
      var params;
      var responder;

      beforeEach(function(){
        transitions = group.get('timelines').first().get('transitions');
        params = transitions.first().get('params');
        responder = { event: function(){} };
        spyOn(responder, 'event').andCallThrough();
        group.on('construct:timeline', responder.event);
      });

      afterEach(function(){
        this.removeAllSpies();
      });

      it ('should be called when a param gets removed', function(){
        params.remove(params.first());

        expect(responder.event).toHaveBeenCalled();
        expect(responder.event.callCount).toBe(1);
      });

      it ('should be called when a param gets added', function(){
      	params.add({param: 'z', value: '0'})
      	params.add({param: 'y', value: '0'})

        expect(responder.event).toHaveBeenCalled();
        expect(responder.event.callCount).toBe(2);
      });

      it ('should be called when a param changes', function(){
        params.first()
          .set('value', 100)
          .set('value', 200)
          .set('value', 300);

        expect(responder.event).toHaveBeenCalled();
        expect(responder.event.callCount).toBe(3);
      });

      it ('should be called when a transition gets removed', function(){
      	transitions.remove(transitions.first());

        expect(responder.event).toHaveBeenCalled();
      });

      it ('should be called when a transition gets added', function(){
        transitions.add({frame: 1, ease: 'Linear.easeNone', params: [] });
        expect(responder.event).toHaveBeenCalled();
      });

      it ('should be called when a transition changes', function(){
        transitions.first().set('ease', 'Other Easing');
        expect(responder.event).toHaveBeenCalled();
      });

      it ('should reset element._gsTweenID with a different id', function(){
        var head = puppet.$head.get(0);

        group.constructTimeline();
      	var first = head._gsTweenID;

        group.constructTimeline();
        var second = head._gsTweenID;

        expect(first).not.toBe(second);
      });

    });

  });

})();
