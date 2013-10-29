'use strict';

/**
 * Use spirit & jasmine helpers with _
 * @type {*}
 * @private
 */
var _ = use('spirit._helpers');
_.extend(_, use('jasmine._helpers'));


describe('ElementModel', function() {


	var m;

	it('should create a default model', function() {
		m = new spirit.model.ElementModel();

		expect(m.get('el')).toBeNull();
		expect(m.get('id')).toBeNull();
		expect(m.get('transitions') instanceof use('spirit.collection').TransitionCollection).toBeTruthy();
	});

	it('should create a custom model', function() {
		var props = {
			el: $('<div />'),
			id: 'element-1'
		};

		m = new spirit.model.ElementModel(props);
		expect(m.get('el')).toBe(props.el);
		expect(m.get('id')).toBe(props.id);
		expect(m.get('transitions') instanceof use('spirit.collection').TransitionCollection).toBeTruthy();
	});


	describe('Storing & Retrieving data', function() {

		var m;

		beforeEach(function() {
			m = new spirit.model.ElementModel({
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
			expect(transitions instanceof use('spirit.collection').TransitionCollection).toBeTruthy();
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