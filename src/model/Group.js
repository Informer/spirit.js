(function(ns) {

  'use strict';

  ns.Group = ns.Abstract.extend({

    defaults: {
      name: 'no title',
      timelines: 'spirit.collection.Timelines'
    },

    timeline: new globalDefaults.timeline({ useFrames: true, paused: true }),

    initialize: function(){
      _.autoBind(this);

      this.get('timelines').on('add reset remove change change:transitions', this.constructTimeline);
      this.constructTimeline();
    },

    /**
     * Create timeline from all timelines in this group
     * @returns {ns.Group}
     */
    constructTimeline: function(){
      this.timeline.kill();
      this.timeline.clear();

      // get rid of existing styling and transforms
      this.get('timelines').each(function(tl){
        globalDefaults.tween.killTweensOf(tl.get('el'));
        tl.get('el').attr('style', '');
      });

      this.get('timelines').each(function(tl){
        this.timeline.add(new (use('spirit.factory').Timeline)(tl.get('el'), tl.get('transitions')).play(), 0);
      }, this);

      this.trigger('construct:timeline', this.timeline);
      return this;
    }

  });

})(use('spirit.model'));
