(function() {
	'use strict';

	/**
	 * Use spirit & jasmine helpers with _
	 * @type {*}
	 * @private
	 */
	var _ = use('spirit._helpers');
	_.extend(_, use('jasmine._helpers'));

	var model = use('spirit.model');

	describe('$.spiritAnimateTo', function() {


		it('should exist in jQuery.fn', function() {
			expect($.fn.spiritAnimateTo).toBeDefined();
		});


		describe('execute on element with empty spirit-states', function() {

			var $el;

			beforeEach(function() {
				$el = $('<div />');
			});

			it('should raise an error when invalid parameters are supplied', function() {
				expect(function() {
					$el.spiritAnimateTo();
				}).toThrow('invalid function parameters provided for jQuery.spiritAnimateTo');
			});

			it ('should contain empty StatesModel', function(){
				$el.spiritAnimateTo(3, {});

				var statesModel = $el.data('spirit-states');
				expect(statesModel instanceof model.StatesModel).toBeTruthy();

				console.log('m -> ', statesModel.get('states'));
				window.tr = statesModel.get('states');



			});

		});


	});

})();
