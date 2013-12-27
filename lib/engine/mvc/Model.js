/**
 * This is master model.
 * @class Master.Model
 * @extends {enyo.Model}
 */
enyo.kind({
	name: "Master.Model",
	kind: "enyo.Model",
	mixins:[
		"Master.ClassSupport"
	],
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.setupStoreSource();
		};
	}),
	/**
	 * Set default store source for application if we enabled cache in Master.config.cache.
	 * use enyo default "ajax" / "jsonp" /customized "websql" / localstorage
	 * this.defaultSource = "ajax"; // 'ajax' or 'jsonp' now supported by enyo lib.
	 * 
	 */
	setupStoreSource: function () {
		var cache = Master.config.cache;
		if (cache && cache.enbaled) {
			this.zLog("current enabled cache!");
			switch (cache.cacheStrategy) {
				case "websql":
					this.store.addSources({ websql: "Master.WebsqlAjaxSource"});
					this.store.set("source", "websql");
				break;
				case "localstorage":
					this.store.addSources({ localstorage: "Master.LocalstorageAjaxSource"});
					this.store.set("source", "localstorage");
				break;
			}
		} else {
			this.zLog("current disabled cache, use enyo stardard ajax or jsonp store source!");
		}
	},		
	testModelMethod: function () {
		var log = [{test:"json object"},{my:"name"}];
		this.zLog("test method",log);
		this.log("test method1", log);
		this.zError("test", log);
		this.zWarn("test", log)
	}
});