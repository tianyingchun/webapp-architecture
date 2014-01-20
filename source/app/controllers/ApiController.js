/**
 * controllers namespace start Master.controllers.ApiController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.ApiController",
	kind: "Master.Controller",
	// set up default language for current api document.
	defaultLanguage: Master.config.defaultAPILanguage,
	// detial view kind name.
	_detailViewKindName: "api.Detail",

	mixins:[
		//Note we have bindinged view and controller mapping for leftdock view. so 
		//if we need to render main content we need use event bubble to update.
		"Master.controllers.DockSupport"
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// cache api detail model in the whole controller lifecycle.
			this.apiDetailModel = new Master.models.apipool.ApiItem();
		};
	}),
	// default action :/node/api
	index: function (apiKey){
		this.zLog("apiKey: ", apiKey);
		// show left dock categories.
		this.detail(apiKey, null);
	},
	/**
	 * Action: node,
	 * mapping: { path: "node/:api/:language", controller: "ApiController", action: "detail"}
	 */
	detail: function (apiKey, language) {
		this.zLog("apiKey: ", apiKey, " ,language:", language);
		language = language || this.defaultLanguage;
		//save current user selected language.
		this.saveUserApiLanguage(language);
		// show left dock categories if not.
		this.showDockCategories({apiKey: apiKey});

		// fetch api details information here.
		this.fetchApiDetailInfo(apiKey, language);
	},
	fetchApiDetailInfo: function (apiKey, language) {
		// binding view,
		this.bindingViewToContent(this._detailViewKindName, null, null);

		// view data.
		var viewData = {
			action: "showApiDetailUI", 
			data: {
				apiKey: apiKey,
				language: language
			}
		};
		// use cached  model instance here avoid create multiple modle instance and cached within enyo.store __global__
		// instance.
		this.apiDetailModel.getApiDetail(apiKey, enyo.bindSafely(this, "_showApiDetailInfo", viewData));

		// binding view.
	},
	_showApiDetailInfo: function (viewData, viewModel) {
		// this.zLog("categoryDetail: ", viewData, viewModel);
		this.notifyView(this._detailViewKindName, viewModel, viewData);
	},
	//@* public show categories on left dock
	showDockCategories: function (extraData) {
		Master.view.frame.showSDKPanel();
		if (!Master.view.frame.hasCategoryContentsIndock()) {
			// maybe async fetch data here.
			this.getAllCategories(extraData);
		}
	}
});