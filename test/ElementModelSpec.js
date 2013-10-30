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


	describe('ElementModel', function() {


		var m;

		it('should create a default model', function() {
			m = new model.ElementModel();

			expect(m.get('el')).toBeNull();
			expect(m.get('id')).toBeNull();
			expect(m.get('transitions') instanceof collection.TransitionCollection).toBeTruthy();
		});

		it('should create a custom model', function() {
			var props = {
				el: $('<div />'),
				id: 'element-1'
			};

			m = new model.ElementModel(props);
			expect(m.get('el')).toBe(props.el);
			expect(m.get('id')).toBe(props.id);
			expect(m.get('transitions') instanceof collection.TransitionCollection).toBeTruthy();
		});


		describe('Storing & Retrieving data', function() {

			var m;

			beforeEach(function() {
				m = new model.ElementModel({
					el: $('<div />'),
					id: 'element-1',
					transitions: []
				});
			});

			it('should retrieve correct values', function() {
				var el = m.get('el');
				var id = m.get('id');
				var transitions = m.get('transitions');

				expect(el instanceof $).toBeTruthy();
				expect(id).toBe('element-1');
				expect(transitions instanceof collection.TransitionCollection).toBeTruthy();
			});

			it('should store new values', function() {
				var newId = 'element-2';
				m.set('id', newId);

				expect(m.get('id')).toBe(newId);
			});

			it('should store new values literal', function() {
				var props = {
					el: 'my awesome element',
					id: 'my new id'
				};

				m.set(props);
				expect(m.get('el')).toBe(props.el);
				expect(m.get('id')).toBe(props.id);
			});

		});


	});
})();
