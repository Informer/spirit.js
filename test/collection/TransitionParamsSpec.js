(function() {

	'use strict';

	var _ = jasmine._helpers;

	describe('collection.TransitionParams', function() {

		var coll;

		beforeEach(function() {
			coll = new spirit.collection.TransitionParams();
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

			it ('should animate element', function(){
				var el = document.createElement('div');

				// adding rest css3 params
				coll.add({"param": "z", "value": -50});
				coll.add({"param": "rotateX", "value": -50});
				coll.add({"param": "rotateY", "value": -50});
				coll.add({"param": "rotateZ", "value": -50});
				coll.add({"param": "skewX", "value": -50});
				coll.add({"param": "skewY", "value": -50});
				coll.add({"param": "scaleX", "value": -50});
				coll.add({"param": "scaleY", "value": -50});

				jasmine.Clock.useMock();
				TweenLite.set(el, coll.constructTweenObject());
				jasmine.Clock.tick(1);

				expect(el._gsTransform.x).toEqual(-50);
				expect(el._gsTransform.y).toEqual(-400);
			});

		});


	});

})();
