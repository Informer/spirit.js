(function() {
	'use strict';

	var _ = jasmine._helpers;

	describe('TransitionCollection', function() {

		var coll,
			transitions = _.loadFixture('transitions.json').transitions;


		it('should create a default collection', function() {
			coll = new spirit.collection.TransitionCollection();
			expect(coll instanceof spirit.collection.TransitionCollection).toBeTruthy();
		});


		describe('Create custom collection', function() {

			beforeEach(function() {
				coll = new spirit.collection.TransitionCollection(transitions);
			});

			afterEach(function() {
				coll = null;
			});

			it('should have 2 transitions', function() {
				expect(coll.length).toEqual(2);
			});

			it('should have 2 models of type TransitionsModel', function() {
				_.each(coll.models, function(m) {
					expect(m instanceof spirit.model.TransitionModel);
				});
			});

			it('should have 1 model after deleting 1st model', function() {
				coll.remove(coll.models[0]);
				expect(coll.length).toEqual(1);

				var m = coll.models[0];
				expect(m.get('frame')).toEqual(200);
			});

			it('should have 3 models after adding another', function() {
				var m = new spirit.model.TransitionModel({
					params: {},
					ease: 'Linear.awesomeness'
				});

				var added = coll.add({
					params: {},
					ease: 'Linear.awesomeness'
				});
				expect(coll.length).toEqual(3);
				expect(added.attributes).toEqual(m.attributes);
				expect(added instanceof m.constructor).toBeTruthy();
			});

		});

	});

})();
