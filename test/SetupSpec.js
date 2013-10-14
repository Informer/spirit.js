'use strict';

describe('Spirit', function() {

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


	describe('Instantiate spirit.Timeline', function(){

		var timeline;

		beforeEach(function(){
			timeline = new spirit.Timeline();
		});

		it ('should be an instance of Spirit', function(){
			expect(timeline instanceof spirit.Timeline).toBeTruthy();
		});

	});


});