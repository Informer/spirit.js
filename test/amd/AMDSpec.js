define(['spirit.min'], function(spirit) {

  'use strict';

  describe('AMD compatible', function() {

    it('should have a module of spirit', function() {
      expect(spirit).toBeDefined();
    });

    it('should not be populated to global namespace (window)', function() {
      expect(window.spirit).toBeUndefined();
    });

    it('should run a regular test (create empty collection)', function() {
      var c = new spirit.collection.States();
      expect(c.length).toBe(0);
      expect(c.model).toBe(spirit.model.State);
    });

  });

});

