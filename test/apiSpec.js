(function() {

  'use strict';

  var _ = jasmine._helpers;

  describe('api', function() {

    describe('groups', function() {

      it('shouldn\'t have any groups', function() {
        expect(spirit.groups.length()).toBe(0);
      });

      it('should retrieve a group by name', function() {
        var puppet = {};
        puppet.$head = $('<div data-spirit-id="puppet-head">HEAD</div>').appendTo('body');
        puppet.$body = $('<div data-spirit-id="puppet-body">BODY</div>').appendTo('body');
        puppet.$handLeft = $('<div data-spirit-id="puppet-hand-left">HAND LEFT</div>').appendTo('body');
        puppet.$handRight = $('<div data-spirit-id="puppet-hand-right">HAND RIGHT</div>').appendTo('body');

        spirit.groups.add(_.loadFixture('groups.json').groups);
        var aap = spirit.groups.add({
          name: 'aap',
          timelines: []
        });

        expect(spirit.groups.length()).toBe(2);
        expect(spirit.groups.get('aap')).toBe(aap);

        var puppetAnimation = spirit.groups.get('puppet-animation');
        expect(puppetAnimation.timeline instanceof TimelineLite).toBeTruthy();
        expect(puppetAnimation.get('timelines').length).toBe(4);

        for (var i in puppet) {
          puppet[i].remove();
        }
      });

    });

  });

})();
