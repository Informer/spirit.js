(function(ns) {

  'use strict';

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

      // get rid of existing styling and transforms
      this.get('timelines').each(function(tl){
        globalDefaults.tween.killTweensOf(tl.get('el'));
        //tl.get('el').attr('style', '');
      });

      this.get('timelines').each(function(tl){
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
      this._animateProps.frame = from || 1;
      var toFrame = to || this.timeline.duration();

      if (this._animateProps.frame >= toFrame) {
        globalDefaults.tween.ticker.removeEventListener("tick", this.tick);
      }else{
        this._tween = globalDefaults.tween.to(this._animateProps, this.timeline.duration() / this.get('fps'), {frame: toFrame, onComplete: this.stop});
        globalDefaults.tween.ticker.addEventListener("tick", this.tick);
      }
    },

    tick: function(){
      if (!this.timeline.paused()) {
        this.timeline.pause();
      }
      this.timeline.seek(this._animateProps.frame);
    },

    /**
     * Stop animation
     */
    stop: function(){
      if (this._tween) {
        this._tween.kill();
        globalDefaults.tween.killTweensOf(this._animateProps);
        this.timeline.pause();
      }
      globalDefaults.tween.ticker.removeEventListener("tick", this.tick);
    }

  });

})(use('spirit.model'));
