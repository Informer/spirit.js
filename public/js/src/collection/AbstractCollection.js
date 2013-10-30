(function(ns) {

	'use strict';

	/**
	 * Helpers
	 * @type {*}
	 */
	var _ = use('spirit._helpers');


	ns.AbstractCollection = function(models) {
		this._construct(models);
	};

	ns.AbstractCollection.extend = _.extendObjectWithSuper;
	_.extend(ns.AbstractCollection.prototype, use('spirit.event').Events, {

		_byId: {},

		model: null,
		length: 0,
		models: [],
		comparator: false,

		_construct: function(models) {
			_.autoBind(this);

			this.model = exist(this.model) ? use(this.model) : use('spirit.model').AbstractModel;
			this.reset(models);
			this.initialize();
		},

		_removeReference: function(model) {
			if (this === model.collection) {
				delete model.collection;
			}
			model.off('all', this._onModelEvent, this);
		},

		_prepareModel: function(attrs, options) {
			if (attrs instanceof use('spirit.model').AbstractModel) {
				if (!attrs.collection) {
					attrs.collection = this;
				}
				return attrs;
			}
			options = options ? _.clone(options) : {};
			options.collection = this;
			var model = new this.model(attrs, options);
			if (!model.validationError) {
				return model;
			}
			this.trigger('invalid', this, model.validationError, options);
			return false;
		},

		initialize: function() {
			return this;
		},

		reset: function(models, options) {
			/* jshint -W030 */

			// remove references of each model
			_.each(this.models, function(m) {
				this._removeReference(m);
			}, this);

			// reset vars
			this.length = 0;
			this.models = [];
			options || (options = {});

			// add models
			models = this.add(models, _.extend({silent: true}, options));
			if (!options.silent) {
				this.trigger('reset', this, options);
			}
			return models;
		},

		// Add a model, or list of models to the set.
		add: function(models, options) {
			return this.set(models, _.extend({merge: false}, options, {add: true, remove: false}));
		},

		get: function(obj) {
			if (obj === null) {
				return void 0;
			}
			return this._byId[obj.id] || this._byId[obj];
		},

		set: function(models, options) {
			/* jshint -W116 */
			/* jshint -W084 */
			/* jshint -W055 */

			options = _.extend({}, options, {add: true, remove: true, merge: true});

			var singular = !_.isArray(models);

			models = singular ? (models ? [models] : []) : _.clone(models);


			var i, l, id, model, attrs, existing, sort;
			var at = options.at;
			var targetModel = this.model;
			var sortable = this.comparator && (at == null) && options.sort !== false;
			var sortAttr = _.isString(this.comparator) ? this.comparator : null;

			var toAdd = [],
				toRemove = [],
				modelMap = {};

			var add = options.add, merge = options.merge, remove = options.remove;
			var order = !sortable && add && remove ? [] : false;

			// Turn bare objects into model references, and prevent invalid models
			// from being added.
			for (i = 0, l = models.length; i < l; i++) {
				attrs = models[i];
				if (attrs instanceof use('spirit.model').AbstractModel) {
					id = model = attrs;
				} else {
					id = new targetModel(attrs);
				}

				// If a duplicate is found, prevent it from being added and
				// optionally merge it into the existing model.
				if (existing = this.get(id)) {
					if (remove) {
						modelMap[existing.cid] = true;
					}
					if (merge) {
						attrs = attrs === model ? model.attributes : attrs;
						if (options.parse) {
							attrs = existing.parse(attrs, options);
						}
						existing.set(attrs, options);
						if (sortable && !sort && existing.hasChanged(sortAttr)) {
							sort = true;
						}
					}
					models[i] = existing;

					// If this is a new, valid model, push it to the `toAdd` list.
				} else if (add) {
					model = models[i] = this._prepareModel(attrs, options);
					if (!model) {
						continue;
					}
					toAdd.push(model);

					// Listen to added models' events, and index models for lookup by
					// `id` and by `cid`.
					model.on('all', this._onModelEvent, this);
					this._byId[model.cid] = model;
					if (model.id != null) {
						this._byId[model.id] = model;
					}
				}
				if (order) {
					order.push(existing || model);
				}
			}

			// Remove nonexistent models if appropriate.
			if (remove) {
				for (i = 0, l = this.length; i < l; ++i) {
					if (!modelMap[(model = this.models[i]).cid]) {
						toRemove.push(model);
					}
				}
				if (toRemove.length) {
					this.remove(toRemove, options);
				}
			}

			// See if sorting is needed, update `length` and splice in new models.
			if (toAdd.length || (order && order.length)) {
				if (sortable) {
					sort = true;
				}
				this.length += toAdd.length;
				if (at != null) {
					for (i = 0, l = toAdd.length; i < l; i++) {
						this.models.splice(at + i, 0, toAdd[i]);
					}
				} else {
					if (order) {
						this.models.length = 0;
					}
					var orderedModels = order || toAdd;
					for (i = 0, l = orderedModels.length; i < l; i++) {
						this.models.push(orderedModels[i]);
					}
				}
			}

			// Silently sort the collection if appropriate.
			if (sort) {
				this.sort({silent: true});
			}

			// Unless silenced, it's time to fire all appropriate add/sort events.
			if (!options.silent) {
				for (i = 0, l = toAdd.length; i < l; i++) {
					(model = toAdd[i]).trigger('add', model, this, options);
				}
				if (sort || (order && order.length)) {
					this.trigger('sort', this, options);
				}
			}

			// Return the added (or merged) model (or models).
			return singular ? models[0] : models;
		},

		remove: function(models, options) {
			_.isFunction(models);
			_.isFunction(options);
		},

		toString: function() {
			return "[object AbstractCollection]";
		}

	});

	/**
	 * Mark as parseable
	 * In model.defaults {} we can provide class, while creating instance defaults will be set
	 * @type {boolean}
	 */
	ns.AbstractCollection.parseable = true;


})(use('spirit.collection'));