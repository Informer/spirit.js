(function() {

  'use strict';

  describe('collection.States', function() {

    it('should create empty collection', function() {
      var c = new spirit.collection.States();
      expect(c.length).toBe(0);
      expect(c.model).toBe(spirit.model.State);
    });

    it('should create 2 models in collection passed in constructor', function() {
      var states = [
        { name: 'open', tweenObj: {x: 1200, y: -88, ease: 'Strong.easeOut'} },
        { name: 'closed', tweenObj: {x: 1200, y: -88, ease: 'Strong.easeOut'} }
      ];

      var c = new spirit.collection.States(states);
      expect(c.length).toBe(2);
      expect(c.model).toBe(spirit.model.State);
      expect(c.at(0).get('name')).toBe('open');
      expect(c.at(1).get('name')).toBe('closed');
    });

    it('should contain 1 state after adding state', function() {
      var c = new spirit.collection.States();
      c.add(new spirit.model.State({
        name: 'open',
        tweenObj: {x: 1200, y: -88, ease: 'Strong.easeOut'}
      }));
      expect(c.length).toBe(1);
      expect(c.where({name: 'open'}).length).toBe(1);
      expect(c.where({name: 'open'})[0].get('name')).toBe('open');
    });

  });

})();
