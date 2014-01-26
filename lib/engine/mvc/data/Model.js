/**
 * This is master model. Note one model only one api request.
 * The same api  "POST/PUT", "GET" , "DELETE"
 * @class Master.Model
 * @extends {enyo.Model}
 */
enyo.kind({
	name: "Master.Model",
	kind: "enyo.Model",
	mixins:[
		"Master.ClassSupport",
		"Master.CommonDTOSupport",
		// provider basic methods infrastures for model, collection.
		"Master.ModelSupport"
	],
	constructed: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// we must set urlRoot in constructed or contructor need to wait Master.config is ready
			this.urlRoot = Master.config.urlRoot;
			// ajax cache bust.
			this._defaultApiOpts.cacheBust = Master.config.cacheBust;
			this._setupStoreSource();
		};
	}),
	/**
	 * @override,maybe the enyo.Model.js has some problem, this.destroyed=true if invoked before user customized 
	 * success callback, the callback won't be executed if we use this.bindSafely.
	 * When a record is successfully destroyed, this method is called before any
	 * user-provided callbacks are executed.
	 */
	didDestroy: function (rec, opts, res) {
		for (var k in this.attributes) {
			if (this.attributes[k] instanceof enyo.Model || this.attributes[k] instanceof enyo.Collection) {
				if (this.attributes[k].owner === this) {
					this.attributes[k].destroy();
				}
			}
		}
		this.triggerEvent("destroy");
		this.store._recordDestroyed(this);
		this.previous    = null;
		this.changed     = null;
		this.defaults    = null;
		this.includeKeys = null;
		this.mergeKeys   = null;
		this.store       = null;
		// this.destroyed   = true;

		// we don't call the inherited destroy chain so we do our own cleanup
		// to avoid lingering entries
		this.removeAllObservers();
		this.removeAllListeners();

		if (opts && opts.success) {
			opts.success(rec, opts, res);
		}
		//FIXME,move this line to the bottom, make sure the opts.success can be invoked.
		this.destroyed   = true;
	}
});