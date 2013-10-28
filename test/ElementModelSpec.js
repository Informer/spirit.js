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


describe('ElementModel', function() {


	var m;

	it('should create a default model', function() {
		m = new spirit.model.ElementModel();

		expect(m.attributes).toEqual({
			el: null,
			id: null,
			transitions: []
		});
	});

	it('should create a custom model', function() {
		var customProps = {
			el: $('<div />'),
			id: 'element-1',
			transitions: []
		};

		m = new spirit.model.ElementModel(customProps);
		expect(m.attributes).toEqual(customProps);
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
			expect(transitions).toEqual([]);
		});

		it('should store new values', function() {
			var newId = 'element-2';
			m.set('id', newId);

			expect(m.get('id')).toBe(newId);
		});

		it('should store new values literal', function() {
			var props = {
				el: 'my awesome element',
				id: 'my new id',
				transitions: []
			};

			m.set(props);
			expect(m.attributes).toEqual(props);
			expect(m.get('el')).toBe(props.el);
			expect(m.get('id')).toBe(props.id);
			expect(m.get('transitions')).toBe(props.transitions);
		});

		it('should store new values recursively', function() {
			m.set('transitions', fixtures.oneElementTwoParams.elements[0].transitions);
			expect(m.get('transitions')).toEqual(fixtures.oneElementTwoParams.elements[0].transitions);
			window.m = m;

			// todo parse collection of transitions as models

		});
	});



});