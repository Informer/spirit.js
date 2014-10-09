define(['spirit.min'], function(spirit) {

  'use strict';

  describe('AMD compatible', function() {

    it('should have a module of spirit', function() {
      expect(spirit).toBeDefined();
    });

    it('should not be populated to global namespace (window)', function() {
      expect(window.spirit).toBeUndefined();
    });

    it('should have API available', function() {
      var data = [
        { name: 'group 1', timelines: [] },
        { name: 'group 2', timelines: [] },
        { name: 'group 3', timelines: [] }
      ];

      spirit.load(data);

      expect(spirit.groups.length).toBe(3);
      expect(spirit.groups.get('group 2').timeline.duration()).toBe(0);
      expect(spirit.toJSON()).toEqual(data);
    });

  });

});

