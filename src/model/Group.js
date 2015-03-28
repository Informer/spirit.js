(function(ns) {

  'use strict';

  var raf = _.raf();

  ns.Group = ns.Abstract.extend({

    defaults: {
      name: 'no title',
      fps: 30,
      timelines: 'spirit.collection.Timelines'
    },

    timeline: new globalDefaults.timeline({ useFrames: true, paused: true }),

    initialize: function(){
      _.autoBind(this);

      this.timeline.autoRemoveChildren = false;
      this._animateProps = { frame: 0 };
      this._tween = null;

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

      this.get('timelines').each(function(tl){

        // clear inline style and tweens for element
        var $el = tl.get('el');
        globalDefaults.tween.killTweensOf($el.get(0));
        $el.get(0)._gsTweenID = undefined;
        $el.get(0)._gsTransform = undefined;
        $el.removeAttr('style');

        this.timeline.add(new (use('spirit.factory').Timeline)(tl.get('el'), tl.get('transitions')).play(), 0);
      }, this);

      this.trigger('construct:timeline', this.timeline);
      return this;
    },

    /**
     * Play this group
     * @param from frame
     * @param to frame
     */
    play: function(from, to) {
      this.stop();

      from = from || 0;
      to = to || this.timeline.duration();

      var duration = (to - from) / this.get('fps');

      globalDefaults.tween.fromTo(this._animateProps, duration, {frame: from}, {frame: to, ease: 'linear', onUpdate: this.onUpdate});
    },

    onUpdate: function() {
      raf(_.bind(function(){
        this.timeline.seek(this._animateProps.frame);
      }, this));
    },

    /**
     * Stop animation
     */
    stop: function(){
      globalDefaults.tween.killTweensOf(this._animateProps);
      if (!this.timeline.paused()) {
        this.timeline.pause();
      }
    }

  });

})(use('spirit.model'));
