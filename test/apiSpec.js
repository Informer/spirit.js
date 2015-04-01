(function() {

  'use strict';

  var _ = jasmine._helpers,
      puppetElements,
      groupsJson = _.loadFixture('groups.json').groups,

      addDOMElements = function() {
        puppetElements = {};
        puppetElements.$head = $('<div data-spirit-id="puppet-head">HEAD</div>').appendTo('body');
        puppetElements.$body = $('<div data-spirit-id="puppet-body">BODY</div>').appendTo('body');
        puppetElements.$handLeft = $('<div data-spirit-id="puppet-hand-left">HAND LEFT</div>').appendTo('body');
        puppetElements.$handRight = $('<div data-spirit-id="puppet-hand-right">HAND RIGHT</div>').appendTo('body');
      },
      removeDOMElements = function() {
        for (var i in puppetElements) {
          puppetElements[i].remove();
        }
      };

  describe('api', function() {

    beforeEach(function(){
    	spirit.reset();
      addDOMElements();
    });

    afterEach(function(){
      removeDOMElements();
    });

    describe('groups', function() {

      it('shouldn\'t have any groups at start', function() {
        expect(spirit.groups.length).toBe(0);
      });

      it('should retrieve a group by name', function() {
        spirit.groups.add(groupsJson);
        var aap = spirit.groups.add({
          name: 'aap',
          timelines: []
        });

        expect(spirit.groups.length).toBe(2);
        expect(spirit.groups.get('aap')).toBe(aap);

        var puppetAnimation = spirit.groups.get('puppet-animation');
        expect(puppetAnimation.timeline instanceof TimelineLite).toBeTruthy();
        expect(puppetAnimation.get('timelines').length).toBe(4);
      });

      it ('should not return any group for invalid name', function(){
        spirit.groups.add(groupsJson);
        expect(spirit.groups.get('invalid')).toBe(null);
      });
    });

    describe('params', function(){

      it ('should have a list with transitionparams', function(){
        	expect(spirit.__internals__.params).toBeDefined();

      });

    });

    describe('json', function() {

      it('should import json', function() {
        spirit.load(groupsJson);
        expect(spirit.groups.length).toBe(1);

        var first = spirit.groups.at(0);
        expect(first.timeline instanceof TimelineLite).toBeTruthy();
        expect(first.timeline.duration()).toBe(550);
      });

      it('should export json', function() {
        spirit.load(groupsJson);
        expect(spirit.toJSON()).toEqual(groupsJson);

        var newGroup = {
          name: 'dummy',
          fps: 80,
          timelines: []
        };

        spirit.groups.add(newGroup);
        groupsJson.push(newGroup);

        expect(spirit.toJSON()).toEqual(groupsJson);
      });

    });

  });

})();
