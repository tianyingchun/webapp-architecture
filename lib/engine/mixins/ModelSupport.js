(function(enyo) {
	if (enyo.getPath("Master.ModelSupport")) {
		return;
	}
	/**
	 * The re-used methods for Master.Model and Master.Collection
	 * ALL api request follow result statards.
	 * fetch->GET, commit-> POST,PUT, destroy-> DELETE
	 */
	enyo.setPath("Master.ModelSupport", {
		name: "Master.ModelSupport",
		// declare apis
		apis: {
			// define api 'apiKey:"api1" we should provider it in each api request.
			// api1: {
			// 	url: "/api/category",
			// 	headers: { Authorization: "" }, 
			// 	cache: {
			// 		enabled: true,
			// 		cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
			// 	},
			// 	dto: "categoryDetailDTO"
			// }
		},
		// default dependancy api config.
		//@protected
		_defaultApiOpts: {
			postBody: null, // {username:'terence tian', pwd:'123456'}
			headers: function () {
				return { Authorization: Master.session.getToken() };
			},
			contentType: "application/json",
			cache: {
				enabled: true,
				cacheTime: 5 * 60 * 1000
			},
			// any request will automatically invoke defaultDTO to convert raw data,
			// we can dto: "customizedDTO",
			// source: "ajax",// default is ajax, jsonp, websql, localstorage.
			callback: null
		},
		/**
		 * Ovveride parse methods
		 * @override
		 * @param {object} data the api request options.
		 */
		parse: function (data, options){
			var uniformData = this.apiDefaultDTO(data);
			if (options) {
				// check if has customized dto.
				var customizedDto = options.dto;
				if (customizedDto) {
					uniformData = enyo.call(this, customizedDto, [uniformData]);
				}
			} 
			this.zLog("parsed data: ", uniformData);
			return uniformData;
		},
		/**
		 * @public
		 * The request api entry will invoke service Get request.
		 * method: GET 
		 * @param {object} options the api configuration
		 * e.g. {
		 * 		callback: fn // user callback function
		 * 		postBody: {},
		 * }
		 * Override the fetch method to do some our stuff.
		 */
		fetch: enyo.inherit(function (sup) {
			return function (options) {
				if (options.apiKey){
					var fetchApiOpts = this._resetRequestOptions(options);
					// convert data parameters for 'GET' request.
					if (options.data) {
						fetchApiOpts.params = options.data;
					}
					// the action of this request.
					fetchApiOpts.action = "GET";
					this.zLog("do fetch(GET) request...");
					// do fetch request.
					sup.call(this, fetchApiOpts);
				} else {
					this.zError("You must provider 'apiKey' in options for each api fetch request.");
				}
			};
		}),
		/**
		 * @public
		 * The request api entry will invoke service Get request.
		 * method: 'POST' or 'PUT'
		 * @param {object} options the api configuration
		 * e.g. {
		 * 		callback: fn // user callback function
		 * 		postBody: {},
		 * }
		 * Override the fetch method to do some our stuff.
		 */
		commit: enyo.inherit(function (sup) {
			return function (options) {
				if (options.apiKey){
					var fetchApiOpts = this._resetRequestOptions(options);
					// convert data method for 'POST', 'PUT'
					switch (options.method.toUpperCase()) {
						case "POST":
							// set request action = "delete";
							fetchApiOpts.action = "POST";
							this.isNew = true;
							break;
						case "PUT":
							fetchApiOpts.action = "UPDATE";
							this.isNew = false;
							break;
					}
					if (options.data) {
						fetchApiOpts.postBody = options.data;
					}
					this.zLog("do commit(POST,PUT) request...");
					// do fetch request.
					sup.call(this, fetchApiOpts);
				} else {
					this.zError("You must provider 'apiKey' in options for each api commit request.");
				}
			};
		}),
		/**
		 * @public
		 * The request api entry will invoke service Get request.
		 * method: 'DELETE'
		 * @param {object} options the api configuration
		 * e.g. {
		 * 		callback: fn // user callback function
		 * 		postBody: {},
		 * }
		 * Override the fetch method to do some our stuff.
		 */
		destroy: enyo.inherit(function (sup) {
			return function (options) {
				if (options.apiKey) { 
					var fetchApiOpts = this._resetRequestOptions(options);
					// set request action = "DELETE";
					fetchApiOpts.action = "DELETE";
					this.isNew = false;
					this.zLog("do destroy(DELETE) request...");
					sup.call(this, fetchApiOpts);
				} else {
					this.zError("You must provider 'apiKey' in options for each api destroy request.");
				}
			};
		}),
		/**
		 * Override some api properties defined by current model
		 * @param  {object} options new override api configurations.
		 * @return {object}         new api configurations include default and ovverided.
		 */
		_resetRequestOptions: function (options) {
			// copy api configurations don't override exist api config.
			var requestApi =  enyo.clone(this.apis[options.apiKey]);
			// convert request api parameters.
			var opts = enyo.clone(this._defaultApiOpts);
			// mixin api config first
			enyo.mixin(requestApi, options);
			// mixin default api config
			enyo.mixin(opts, requestApi);

			// make sure that we can provider customized function callback in this.apis = {};
			for(var k in opts) {
				if(k !="callback" && "function" === typeof opts[k]){
					opts[k] = opts[k].call(this);
				}
			}
			// binding success,fail callback from store.
			opts.success = enyo.bindSafely(this, "didSuccessFn");
			opts.fail = enyo.bindSafely(this, "didFailedFn");

			if (Master.config.cache) {
				opts.cache.enabled = Master.config.cache.enabled && opts.cache && opts.cache.enabled;
			}
			this.zLog("api call options: ", opts);
			return opts;
		},
		/**
		 * if fetch data failed it will be fire here.
		 * @param  {object} rec     current model instance.
		 * @param  {object} apiOpts request api options. (fecth options)
		 * @param  {object} res     api source instance (enyo.ajax)
		 */
		didFailedFn: function(rec, apiOpts, res) {
			// do exception DTO. copy error information into current model/collection instance.
			this.apiExceptionDTO(apiOpts, res);
			var callbackFn = apiOpts && 　apiOpts.callback;
			if (callbackFn) {
				callbackFn(rec);
			}
		},

		/**
		 * if fetch data failed it will be fire here.
		 * Note, if we do a delete request, it will don't invoke parse method.
		 * we need to do it in didSuccessFn.
		 * @param  {object} rec     current model instance.
		 * @param  {object} apiOpts request api options. (fecth options)
		 * @param  {object} res     api source instance (enyo.ajax)
		 */
		didSuccessFn: function(rec, apiOpts, res) {
			var callbackFn = apiOpts && apiOpts.callback;
			// for delete, it won't invoke parse() data. so we need to make sure that it also have restInfo property in result model.
			if(apiOpts.action == "DELETE") {
				// make sure that the delete callback also have restInfo property
				var retMessage = Master.locale.get("SUCCESS", "message");
				this._setRestInfo(this, 1, retMessage);
			}
			if (callbackFn) {
				callbackFn(rec);
			}
		},

		/**
		 * @protected
		 * Set default store source for application if we enabled cache in Master.config.cache.
		 * use enyo default "ajax" / "jsonp" /customized "websql" / localstorage
		 * this.defaultSource = "ajax"; // 'ajax' or 'jsonp' now supported by enyo lib.
		 *
		 */
		_setupStoreSource: function() {
			var cache = Master.config.cache;
			if (cache && cache.enabled) {
				this.zLog("current enabled cache!");
				switch (cache.cacheStrategy) {
					case "websql":
						this.store.addSources({
							websql: "Master.WebsqlAjaxSource"
						});
						this._defaultApiOpts.source = "websql";
						break;
					case "localstorage":
						this.store.addSources({
							localstorage: "Master.LocalstorageAjaxSource"
						});
						this._defaultApiOpts.source = "localstorage";
						break;
				}
			} else {
				// TODO , maybe we don't need to use enyo ajax here.
				this.zLog("current disabled cache, use enyo stardard ajax or jsonp store source!");
			}
		}
	});
})(enyo);