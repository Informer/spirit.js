(function() {

  'use strict';

  describe('collection.Groups', function() {

    it('should create empty collection', function() {
      var c = new spirit.collection.Groups();
      expect(c.length).toBe(0);
      expect(c.model).toBe(spirit.model.Group);
      expect(c instanceof spirit.collection.Groups);
    });

    it('should have 2 groups', function() {
      var c = new spirit.collection.Groups([
        { name: 'group 1', timelines: [] },
        { name: 'group 2', timelines: [] }
      ]);

      expect(c.length).toBe(2);
      expect(c.pluck('name')).toEqual(['group 1', 'group 2']);
    });

  });

})();
