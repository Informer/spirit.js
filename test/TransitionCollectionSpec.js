(function() {
	'use strict';


	/**
	 * Use spirit & jasmine helpers with _
	 * @type {*}
	 * @private
	 */
	var _ = use('spirit._helpers');
	_.extend(_, use('jasmine._helpers'));


	/**
	 * Fixtures for testing purposes
	 */
	var fixtures = {
		oneElementTwoParams: _.loadFixture('single_element_2_params.json')
	};


	var collection = use('spirit.collection');

	describe('TransitionCollection', function() {

		var c;

		it('should create a default collection', function() {
			c = new collection.TransitionCollection();
			expect(c instanceof collection.TransitionCollection).toBeTruthy();
		});


		describe('Create custom collection', function() {

			beforeEach(function() {
				c = new collection.TransitionCollection(fixtures.oneElementTwoParams.elements[0].transitions);
			});

			it('should have 2 transitions', function() {
				expect(c.length).toEqual(2);
			});

			it('should have 2 models of type TransitionsModel', function() {
				_.each(c.models, function(m) {
					expect(m instanceof use('spirit.model').TransitionModel);
				});
			});

		});


	});

})();
