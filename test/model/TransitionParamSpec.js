(function() {
	'use strict';

	var _ = jasmine._helpers;

	describe('model.TransitionParam', function() {

		it('should have a list of params', function() {
			var list = spirit.model.TransitionParam.params;
			expect(_.isObject(list)).toBeTruthy();
			expect(_.size(list)).toBeGreaterThan(0);
		});

		it('should validate on CSS Transforms', function() {
			var yes = new spirit.model.TransitionParam({ param: 'x', value: 10 }),
				nope = new spirit.model.TransitionParam({ param: 'left', value: 10 });

			expect(yes.isCSSTransform()).toBeTruthy();
			expect(nope.isCSSTransform()).toBeFalsy();
		});

		it('should listen to change:value events JIT', function() {
			var model = new spirit.model.TransitionParam({ param: 'top', value: 0 }),
				values = [],
				responder = {
					event: function(m, val) {
						values.push(val);
					}
				};

			spyOn(responder, 'event').andCallThrough();
			model.on('change:value', responder.event);

			// 10 times (first index = 0, which is the default value and should be skipped)
			_.times(10, function(n) {
				model.set('value', n);
			});

			// so eventually we should end up with 9 records (1..9)
			expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
			expect(responder.event).toHaveBeenCalled();
			expect(responder.event.callCount).toBe(9);
		});

		it('should give me a valid value when executing getValue()', function() {
			var model = new spirit.model.TransitionParam({ param: 'top', value: 120 });

			expect(model.getValue()).toBe(120);
			model.set('value', '120');
			expect(model.getValue()).toBe('120');
		});

		it ('should validate isEval() when value is wrapped in {}', function(){
			expect(new spirit.model.TransitionParam({ param: 'top', value: '{foobar}' }).isEval()).toBeTruthy();
			expect(new spirit.model.TransitionParam({ param: 'top', value: '' }).isEval()).toBeFalsy();
		});

		it('should evaluate when providing a RegExpMapping', function() {
			var model = new spirit.model.TransitionParam({
					param: 'left',
					value: ''
				}),
				mappingA = new spirit.model.vo.RegExpMapping(/\$this/g, $('<div data-x="20" />')),
				mappingB = new spirit.model.vo.RegExpMapping(/foo/g, {
					bar: function() { return "foobar"; }
				});

			// mapping $this to a jQuery object
			model.set('value', '{$this.data("x") + 10}');
			expect(model.getValue(mappingA)).toBe(30);
			expect(model.getValue([mappingA])).toBe(30);
			expect(model.getValue([mappingA, mappingA, mappingA])).toBe(30);

			// mapping foo to an object with a function bar
			model.set('value', '{foo.bar() + "-secret"}');
			expect(model.getValue(mappingB)).toEqual("foobar-secret");

			// multi-mapping
			model.set('value', '{$this.data("x") + "-" + foo.bar()}');
			expect(model.getValue([mappingA, mappingB])).toEqual("20-foobar");
		});

		describe('with existing js function', function(){

			beforeEach(function(){
				window.doMathPower = function(val) { return Math.pow(val, 2); };
			});

			afterEach(function(){
				delete(window.doMathPower);
			});

			it('should evaluate without a mapping', function() {
				var model = new spirit.model.TransitionParam({
					param: 'top',
					value: '{doMathPower(10)}'
				});

				expect(model.getValue()).toBe(100);
			});

			it ('should evaluate with a mapping', function(){
				var model = new spirit.model.TransitionParam({
					param: 'top',
					value: '{doMathPower(foo) + bar}'
				});

				expect(model.getValue([
					new spirit.model.vo.RegExpMapping(/foo/, 50),
					new spirit.model.vo.RegExpMapping(/bar/, 50)
				])).toBe(2550);
			});
		});

	});

})();
