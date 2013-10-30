(function() {
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


	describe('Spirit Instantiate', function() {

		describe('Dependencies', function() {

			it('spirit is present', function() {
				expect(spirit.Timeline).not.toBeUndefined();
			});

			it('jQuery, TweenLite and TimelineLite', function() {
				expect($).not.toBeUndefined();
				expect(TweenLite).not.toBeUndefined();
				expect(TimelineLite).not.toBeUndefined();
			});

		});


		describe('Instantiate spirit.Timeline directly', function() {

			var timeline;

			beforeEach(function() {
				timeline = new spirit.Timeline($('<div />'));
			});

			it('should be an instance of Spirit', function() {
				expect(timeline instanceof spirit.Timeline).toBeTruthy();
			});

			it('should have jsonData', function() {
				var fixture = fixtures.oneElementTwoParams;
				timeline.parseJSON(fixture);

				expect(timeline._json).toBe(fixture);
			});

			describe('And have an invalid container element', function() {

				it('should raise an error on empty', function() {
					expect(function() {
						timeline = new spirit.Timeline();
					}).toThrow(new Error(spirit.Timeline.errorMessages.noContainerElementFound));
				});

				it('should raise an error on invalid', function() {
					_.every([ 'strings are not valid', 123, {}, $, function() {}, true, false], function(el) {
						expect(function() {
							timeline = new spirit.Timeline(el);
						}).toThrow(new Error(spirit.Timeline.errorMessages.noContainerElementFound));
						return true;
					});
				});

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
				expect(instance instanceof spirit.Timeline).toBeTruthy();
			});

			it('should have jsonData', function() {
				var fixture = fixtures.oneElementTwoParams;

				Timeline = Timeline.extend({ jsonData: fixture });

				var instance = new Timeline($('<div />'));
				expect(instance._json).toBe(fixture);
			});

			it('should call super on initialize', function() {
				Timeline = Timeline.extend({
					initialize: function() {
						this._super();
					}
				});

				spyOn(Timeline.prototype, 'initialize');

				var instance = new Timeline($('<div />'));
				expect(instance.initialize).toHaveBeenCalled();
			});

		});


		describe('Override default options', function() {

			describe(':tweeningEngine', function() {

				it('should raise an error on providing invalid tweening engine values', function() {
					var tl,
						shouldRaiseError = function() {
							tl = new spirit.Timeline($('<div />'), {
								tweenEngine: {
									tween: 'invalid tween',
									timeline: 'invalid timeline'
								}
							});
						};

					expect(shouldRaiseError).toThrow(new Error(spirit.Timeline.errorMessages.invalidTweeningEngines));
				});

				it('should have default TweenLite/TimelineLite', function() {
					var tl = new spirit.Timeline($('<div />'));
					expect(tl.options.tweenEngine.tween).toBe(window.TweenLite);
					expect(tl.options.tweenEngine.timeline).toBe(window.TimelineLite);
				});

				it('should have custom tweening engines', function() {
					var tweenFn = function() {},
						timelineFn = function() {};

					var tl = new spirit.Timeline($('<div />'), {
						tweenEngine: {
							tween: tweenFn,
							timeline: timelineFn
						}
					});

					expect(tl.options.tweenEngine.tween).toBe(tweenFn);
					expect(tl.options.tweenEngine.timeline).toBe(timelineFn);
				});

			});

			describe(':childSelector', function() {

				it('should have the default \'*\' selector', function() {
					var tl = new spirit.Timeline($('<div />'));
					expect(tl.options.childSelector).toEqual('*');
				});

				it('should have custom child selector', function() {
					var selector = '[data-spirit]';
					var tl = new spirit.Timeline($('<div />'), {
						childSelector: selector
					});
					expect(tl.options.childSelector).toEqual(selector);
				});

			});

			describe(':forceDebug', function() {

				it('should have debug false by default', function() {
					var tl = new spirit.Timeline($('<div />'));
					expect(tl.isDebug()).toBeFalsy();
				});

				it('should have force debug (true)', function() {
					var tl = new spirit.Timeline($('<div />'), { forceDebug: true });
					expect(tl.isDebug()).toBeTruthy();
				});

			});

		});


	});
})();

