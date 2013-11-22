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

	describe('$.spiritAnimateTo', function() {


		it('should exist in jQuery.fn', function() {
			expect($.fn.spiritAnimateTo).toBeDefined();
		});


		describe('execute on element without spirit-states', function() {
			var $el;

			beforeEach(function() {
				$el = $('<div />');
			});

			afterEach(function() {
				$el.off();
			});

			it('should raise an error when invalid parameters are supplied', function() {
				expect(function() {
					$el.spiritAnimateTo();
				}).toThrow('invalid function parameters provided for jQuery.spiritAnimateTo. ' +
						'First param needs to be a state (string) or speed (number)');
			});

			it('should dispatch error event when animate to unknown state', function() {
				var events = {
					error: function() {}
				};

				spyOn(events, 'error');

				$el.on('spirit_error', events.error);
				$el.spiritAnimateTo('open', 1);

				expect(events.error).toHaveBeenCalled();
				expect(events.error.mostRecentCall.args[1]).toEqual({msg: "jQuery.spiritAnimateTo: State[open] not found on element"});
			});

			it('should animate to position when no state is provided', function() {
				jasmine.Clock.useMock();

				$el.spiritAnimateTo(0, {
					x: 100,
					y: 200,
					ease: 'Cubic.easeInOut'
				});

				jasmine.Clock.tick(1);
				expect($el.get(0)._gsTransform.x).toEqual(100);
			});
		});


		describe('execute on element with spirit-states', function() {
			var $el, states = {
				open: {
					x: 500,
					y: 300,
					alpha: 0.5
				},
				close: {
					x: 0,
					y: 0,
					alpha: 1
				}
			};

			beforeEach(function() {
				$el = $('<div data-spirit-states="' + JSON.stringify(states).replace(/"/g, '') + '">');
			});

			it('should have 2 states', function() {
				$el.spiritAnimateTo("open", 0);

				var states = $el.data('spirit-states');
				expect(states instanceof collection.StatesCollection).toBeTruthy();
				expect(states.length).toEqual(2);
			});

			it('should dispatch error event when trying to animate to unknown state', function() {
				var events = {
					error: function() {}
				};

				spyOn(events, 'error');

				$el.on('spirit_error', events.error);
				$el.spiritAnimateTo("unknown state", 0);

				expect(events.error).toHaveBeenCalled();
				expect(events.error.mostRecentCall.args[1]).toEqual({msg: "jQuery.spiritAnimateTo: State[unknown state] not found on element"});
			});

			it('should animate to open state', function() {
				jasmine.Clock.useMock();

				$el.spiritAnimateTo("open", 0);

				jasmine.Clock.tick(1);
				expect($el.get(0)._gsTransform.x).toEqual(states.open.x);
				expect($el.get(0)._gsTransform.y).toEqual(states.open.y);
			});

			it('should animate to close state', function() {
				jasmine.Clock.useMock();

				$el.spiritAnimateTo("close", 0);

				jasmine.Clock.tick(1);
				expect($el.get(0)._gsTransform.x).toEqual(states.close.x);
				expect($el.get(0)._gsTransform.y).toEqual(states.close.y);
			});
		});


		describe('execute on element directly (no states)', function() {

		});


	});

})();
