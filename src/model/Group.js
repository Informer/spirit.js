(function(ns) {

  'use strict';

  var raf = _.raf();

  ns.Group = ns.Abstract.extend({

    defaults: {
      name: 'no title',
      fps: 30,
      timelines: 'spirit.collection.Timelines'
    },

    initialize: function(){
      _.autoBind(this);

      this.timeline = new globalDefaults.timeline({ useFrames: true, paused: true });
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
        var el = tl.get('el').get(0);
        globalDefaults.tween.killTweensOf(el);

        delete el._gsTransform;
        delete el._gsTweenID;

        tl.get('el').attr('style', '');

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
    stop: function() {
      globalDefaults.tween.killTweensOf(this._animateProps);
      if (!this.timeline.paused()) {
        this.timeline.pause();
      }
    },

    /**
    * Export group to JSON
    * @returns {Object}
    */
    toJSON: function() {
      var jsonData = this._super();
      jsonData.timelines = this.get('timelines').toJSON();
      return jsonData;
    }

  });

})(use('spirit.model'));
