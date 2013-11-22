(function() {
	'use strict';


	/**
	 * Use spirit & jasmine helpers with _
	 * @type {*}
	 * @private
	 */
	var _ = use('spirit._helpers');
	_.extend(_, use('jasmine._helpers'));


	var model = use('spirit.model'),
		collection = use('spirit.collection');


	_.isFunction(model);

	describe('StatesCollection', function() {

		it('should create empty collection', function() {
			var c = new collection.StatesCollection();
			expect(c.length).toBe(0);
			expect(c.model).toBe(model.StateModel);
		});

		it('should create 2 model in collection passed in constructor', function() {
			var states = [
				{ name: 'open',     tweenObj: {x: 1200, y: -88, ease: 'Strong.easeOut'} },
				{ name: 'closed',   tweenObj: {x: 1200, y: -88, ease: 'Strong.easeOut'} }
			];

			var c = new collection.StatesCollection(states);
			expect(c.length).toBe(2);
			expect(c.model).toBe(model.StateModel);
			expect(c.at(0).get('name')).toBe('open');
			expect(c.at(1).get('name')).toBe('closed');
		});

		it('should contain 1 state after adding state', function() {
			var c = new collection.StatesCollection();
			c.add(new model.StateModel({
				name: 'open',
				tweenObj: {x: 1200, y: -88, ease: 'Strong.easeOut'}
			}));
			expect(c.length).toBe(1);
			expect(c.where({name: 'open'}).length).toBe(1);
			expect(c.where({name: 'open'})[0].get('name')).toBe('open');
		});


	});

})();
