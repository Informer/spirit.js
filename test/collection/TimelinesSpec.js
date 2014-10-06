(function() {

  'use strict';

  var _ = jasmine._helpers;

  describe('collection.Timelines', function() {

    it ('should bubble change:transitions events', function(){
      var $el = $('<div data-spirit-id="menu" />').appendTo('body'),
          timelines = new spirit.collection.Timelines(_.loadFixture('timeline.json').timelines);

      var responder = {
        event: function(){}
      };

      spyOn(responder, 'event');
      timelines.on('change:transitions', responder.event);
      timelines.first().get('transitions').first().set('ease', 'Strong.easeOut');
      timelines.last().get('transitions').last().set('ease', 'Linear.easeOut');

      expect(responder.event).toHaveBeenCalled();
      expect(responder.event.callCount).toBe(2);
      $el.remove();
    });

  });

})();
