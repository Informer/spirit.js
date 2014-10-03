(function() {
  'use strict';

  var _ = jasmine._helpers;

  describe('collection.Transitions', function() {

    var coll,
        transitions = _.loadFixture('transitions.json').transitions;


    it('should create a default collection', function() {
      coll = new spirit.collection.Transitions();
      expect(coll instanceof spirit.collection.Transitions).toBeTruthy();
    });


    describe('Create custom collection', function() {

      beforeEach(function() {
        coll = new spirit.collection.Transitions(transitions);
      });

      afterEach(function() {
        coll = null;
      });

      it('should have 2 transitions', function() {
        expect(coll.length).toEqual(2);
      });

      it('should have 2 models of type model.Transition', function() {
        _.each(coll.models, function(m) {
          expect(m instanceof spirit.model.Transition);
        });
      });

      it('should have 1 model after deleting 1st model', function() {
        coll.remove(coll.models[0]);
        expect(coll.length).toEqual(1);

        var m = coll.models[0];
        expect(m.get('frame')).toEqual(200);
      });

      it('should have 3 models after adding another', function() {
        var m = new spirit.model.Transition({frame: 1, params: {}, ease: 'Linear.awesomeness'}),
            added = coll.add({ frame: 2, params: {}, ease: 'Linear.awesomeness' });

        expect(coll.length).toEqual(3);
        expect(added instanceof m.constructor).toBeTruthy();
      });

    });

    describe('Chaining models', function() {

      var coll;

      beforeEach(function() {
        coll = new spirit.collection.Transitions();
        coll.add({ frame: 100, ease: 'Linear.easeNone', params: [] });
        coll.add({ frame: 12, ease: 'Linear.easeNone', params: [] });
        coll.add({ frame: 323, ease: 'Linear.easeNone', params: [] });
        coll.add({ frame: 33, ease: 'Linear.easeNone', params: [] });
      });

      afterEach(function() {
        coll.reset();
      });

      it('should order collection by frame (via comparator)', function() {
        expect(coll.at(0).get('frame')).toBe(12);
        expect(coll.at(coll.length - 1).get('frame')).toBe(323);
        expect(coll.pluck('frame')).toEqual([12, 33, 100, 323]);
      });

      it('should have previous model', function() {
        expect(coll.at(0).get('previousModel')).toBeUndefined();

        _.times(coll.length - 1, function(i) {
          expect(coll.at(i + 1).get('previousModel')).toBe(coll.at(i));
        });
      });
    });

  });

})();
