define(['jquery'], function($) {

  'use strict';

  var spirit;

  var waitForSpirit = function() {
    spirit = false;
    require(['spirit.min'], function(s) { spirit = s; });
    waitsFor(function() { return !!spirit; }, 'Timed out', 1000);
  };

  describe('chrome extension events', function() {
    it('should trigger an event on spirit loaded', function() {
      expect(window.spiritLoaded).toBeUndefined();

      var responder = {event: function() {}};
      spyOn(responder, 'event').andCallThrough();
      expect(responder.event).not.toHaveBeenCalled();
      $(window).on('spirit-loaded', responder.event);

      waitForSpirit();
      runs(function() {
        expect(window.spiritLoaded).toBeTruthy();
        expect(responder.event).toHaveBeenCalled();
        expect(responder.event.calls.length).toBe(1);
      });
    });
  });

  describe('AMD compatible', function() {

    beforeEach(waitForSpirit);
    afterEach(function() {
      spirit = undefined;
      window.spiritLoaded = undefined;
    });

    it('should have a module of spirit', function() {
      runs(function() {
        expect(spirit).toBeDefined();
      });
    });

    it('should not be populated to global namespace (window)', function() {
      runs(function() {
        expect(window.spirit).toBeUndefined();
        expect(spirit).toBeDefined();
      });
    });

    it('should have API available', function() {
      runs(function() {
        var data = [
          {name: 'group 1', timelines: []},
          {name: 'group 2', timelines: []},
          {name: 'group 3', timelines: []}
        ];

        spirit.load(data);

        expect(spirit.groups.length).toBe(3);
        expect(spirit.groups.get('group 2').timeline.duration()).toBe(0);
        expect(spirit.toJSON()).toEqual(data);
      });
    });
  });

});

