/**
 * This is master model.
 * @class Master.Model
 * @extends {enyo.Model}
 */
enyo.kind({
	name: "Master.Model",
	kind: "enyo.Model",
	mixins:[
		"Master.ClassSupport",
		"Master.CommonDTOSupport"
	],
	//@protected
	_defaultApiOpts: {
		postBody: null,// {username:'terence tian', pwd:'123456'}
		method: "GET",//"GET", "POST", "PUT", "DELETE"
		headers: null,
		contentType: "application/json",
		cache: {
			enabled: true,
			cacheTime: 5 * 60 * 1000
		},
		// source: "ajax",// default is ajax, jsonp, websql, localstorage.
		dto: "defaultDTO",
		callback: null
	},
	published: {
		apis: {}
	},
	constructed: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// we must set urlRoot in constructed or contructor need to wait Master.config is ready
			this._defaultApiOpts.urlRoot = Master.config.urlRoot;
			this._setupStoreSource();
		};
	}),
	/**
	 * @public
	 * The request api entry don't directly use fetch to get service request.
	 * @param {object} options the api configuration 
	 * e.g. {
	 * 		callback: fn // user callback function
	 * 		postBody: {},
	 * }
	 * Override the fetch method to do some our stuff.
	 */
	 fetchApiData: function (apiId, options) {
	 	var requestApi = this.apis[apiId];
	 	// convert request api parameters.
		var opts = enyo.clone(this._defaultApiOpts);
	 	if (requestApi) {
	 		// mixin api config first
	 		enyo.mixin(requestApi, options);
	 		// mixin default api config
	 		enyo.mixin(opts, requestApi);

	 		// binding success,fail callback from store.
	 		opts.success = enyo.bindSafely(this, "didSuccessFn");
	 		opts.fail = enyo.bindSafely(this, "didFailedFn");

	 		if (Master.config.cache) {
	 			opts.cache.enabled = Master.config.cache.enabled && opts.cache.enabled;
	 		}
	 		this.fetch(opts);
	 	} else {
	 		this.zError("can't find the matched api config, apiId: ", apiId);
	 	}
	 },
	 /**
	  * Fetched ajax request fro server.
	  */
	 didSuccessFn: function (){
	 	this.zLog(arguments);
	 },
	 /**
	  * if fetch data failed it will be fire here.
	  * @param  {object} rec     current model instance.
	  * @param  {object} apiOpts request api options. (fecth options)
	  * @param  {object} res     api source instance (enyo.ajax)
	  */
	 didFailedFn: function (rec, apiOpts, res) {
	 	var callbackFn = apiOpts &&　apiOpts.callback;
	 	if (callbackFn) {
	 		var result = this.exceptionDTO(apiOpts, res);
	 		callbackFn(result);
	 	}
	 },
	/**
	 * Ovveride parse methods
	 * @override
	 * @param  {raw} data the raw data.
	 */
	parse: function (data){
		this.rawDataConvertDTO(data, api);
		return data;
	},
	/**
	 * @protected
	 * Set default store source for application if we enabled cache in Master.config.cache.
	 * use enyo default "ajax" / "jsonp" /customized "websql" / localstorage
	 * this.defaultSource = "ajax"; // 'ajax' or 'jsonp' now supported by enyo lib.
	 * 
	 */
	_setupStoreSource: function () {
		var cache = Master.config.cache;
		if (cache && cache.enabled) {
			this.zLog("current enabled cache!");
			switch (cache.cacheStrategy) {
				case "websql":
					this.store.addSources({ websql: "Master.WebsqlAjaxSource"});
					this._defaultApiOpts.source = "websql";
				break;
				case "localstorage":
					this.store.addSources({ localstorage: "Master.LocalstorageAjaxSource"});
					this._defaultApiOpts.source = "localstorage";
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