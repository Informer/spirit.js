(function() {

	'use strict';


	var _ = jasmine._helpers;

	describe('TransitionParamCollection', function() {

		var coll;

		beforeEach(function() {
			coll = new spirit.collection.TransitionParamCollection();
		});

		afterEach(function() {
			coll = null;
		});



		it('should have an empty collection', function() {
			expect(coll.length).toBe(0);
		});


		describe('with fixture data', function(){

			var fixture = _.loadFixture('params.json').params;

			beforeEach(function(){
				coll.add(fixture);
			});
			
			it ('should have corresponding models', function(){
				expect(coll.length).toBe(fixture.length);

				coll.each(function(m, i){
					expect(m.get('param')).toEqual(fixture[i].param);
					expect(m.get('value')).toEqual(fixture[i].value);
				});
			});

			it ('should have constructed a valid GSAP object', function(){
				expect(coll.constructTweenObject(null)).toEqual({
					x: -50,
					y: -400,
					left: 100
				});
			});

		});


	});

})();
