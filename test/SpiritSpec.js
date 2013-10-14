'use strict';

describe('Spirit', function() {


	describe('Dependencies loaded', function() {

		it('spirit is present', function() {
			expect(spirit.Spirit).not.toBeUndefined();
		});

		it('have access to libs', function() {
			expect($).not.toBeUndefined();
			expect(TweenLite).not.toBeUndefined();
			expect(TimelineLite).not.toBeUndefined();
		});
		

	});





});