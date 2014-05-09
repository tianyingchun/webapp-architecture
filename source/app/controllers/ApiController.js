/**
 * controllers namespace start Master.controllers.ApiController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.ApiController",
	kind: "Master.Controller",
	// set up default language for current api document.
	defaultLanguage: Master.config.defaultAPILanguage,

	constants:{
		// detial view kind name.
		API_DETAIL_PAGE: "api.Detail"
	},
	mixins:[
		//Note we have bindinged view and controller mapping for leftdock view. so 
		//if we need to render main content we need use event bubble to update.
		"Master.controllers.DockSupport"
	],
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
	detail: function (apiKey) {
		this.zLog("apiKey: ", apiKey);
		//save current user selected language.
		// this.saveUserApiLanguage(language);
		var configData = {
			fromLevel: 0,
			toLevel: 1,
			apiKey:apiKey
		};
		// fetch api details information here.
		this.fetchApiDetailInfo(apiKey);
	},
	fetchApiDetailInfo: function (apiKey) {
		// binding view,
		this.bindingViewToContent(this.API_DETAIL_PAGE, null, null);
		// view data.
		var viewData = {
			action: "showApiDetailUI", 
			data: {
				apiKey: apiKey
			}
		};
		// use cached  model instance here avoid create multiple modle instance and cached within enyo.store __global__
		var apiItemModel = this.getModelInstance("Master.models.apipool.ApiItem",{id: ""});
		apiItemModel.getApiDetailByKey(apiKey, this.bind("_showApiDetailInfo", viewData));
	},
	_showApiDetailInfo: function (viewData, viewModel) {
		this.showDockCategories(viewModel);
		// this.zLog("categoryDetail: ", viewData, viewModel);
		this.notifyView(this.API_DETAIL_PAGE, viewModel, viewData);
	},
	//@* public show categories on left dock
	showDockCategories: function (viewModel) {
		var currLevel = viewModel.get("level");
		var configData = {
			fromLevel: parseInt(currLevel) -1,
			toLevel: currLevel
		};
		// if fromLevel equals -1 correct it.
		if (!!!~configData.fromLevel) {
			configData.fromLevel = 0;
			configData.toLevel = 1;
		}
		this.zLog("category list Levels: ", configData);

		if (!Master.view.frame.hasCategoryContentsIndock() 
			|| this.ifRefreshDockCategories(configData)
			) {
			// maybe async fetch data here.
			this.getUserAllCategories(configData);
		}
	},
	// *@private indicates if we need to refresh left dock categories.
	ifRefreshDockCategories: function (configData) {
		var lastedDockLevelConfig = Master.view.frame.getCurrentCategoryDockConfig() || {
			fromLevel: 0,
			toLevel: 1
		};
		if (lastedDockLevelConfig.fromLevel == configData.fromLevel 
			&& lastedDockLevelConfig.toLevel == configData.toLevel) {
			return false;
		}
		return true;
	}
});