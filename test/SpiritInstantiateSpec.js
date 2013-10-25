'use strict';


/**
 * Use spirit & jasmine helpers with _
 * @type {*}
 * @private
 */
var _ = use('spirit._helpers');
_.extend(_, use('jasmine._helpers'));


describe('Spirit Instantiate', function() {

	describe('Dependencies are all present', function() {

		it('spirit is present', function() {
			expect(spirit.Timeline).not.toBeUndefined();
		});

		it('jQuery, TweenLite and TimelineLite', function() {
			expect($).not.toBeUndefined();
			expect(TweenLite).not.toBeUndefined();
			expect(TimelineLite).not.toBeUndefined();
		});

	});


	describe('Instantiate spirit.Timeline', function() {

		var timeline;

		beforeEach(function() {
			timeline = new spirit.Timeline($('<div />'));
		});

		it('should be an instance of Spirit', function() {
			expect(timeline instanceof spirit.Timeline).toBeTruthy();
		});

	});

	describe('Extend spirit.Timeline', function() {

		var Timeline;

		beforeEach(function() {
			Timeline = spirit.Timeline.extend({
				initialize: function() {}
			});
		});

		it('should create an extended version of spirit.Timeline', function() {
			var methodsTimeline = _.functions(Timeline),
				methodsSpiritTimeline = _.functions(spirit.Timeline),
				instance = new Timeline($('<div />'));

			expect(methodsTimeline).toEqual(methodsSpiritTimeline);
			expect(methodsTimeline).toEqual(methodsSpiritTimeline);
			expect(instance instanceof spirit.Timeline).toBeTruthy();
		});


		it('should have jsonData', function() {
			var fixture = _.loadFixture('single_element_2_params.json');

			Timeline = Timeline.extend({ jsonData: fixture });

			var instance = new Timeline($('<div />'));
			expect(instance._json).toEqual(fixture);
		});


	});


});