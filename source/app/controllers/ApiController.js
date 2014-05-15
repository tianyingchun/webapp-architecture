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
			parentId: 0,
			level: 0,
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
			parentId: viewModel.get("parentId") || 0,
			level: parseInt(currLevel)-1,
			stopLoop: true
		};
		// if current api has children api show current and it's child api list
		// else show it's parent and parent silbings and childs.
		var children = viewModel.get("children");
		if (children && children.length) {
			configData.parentId = viewModel.get("id");
			configData.level++;
		}
		// if fromLevel equals -1 correct it.
		if (!!!~configData.level) {
			configData.level = 0;
			configData.parentId = 0;
		}
		this.zLog("category list Levels: ", configData);

		if (!Master.view.frame.hasCategoryContentsIndock() 
			|| this.ifRefreshDockCategories(configData)
			) {
			// maybe async fetch data here.
			this.getCategorySiblingsAndChilds(configData);
		} else {
			//todo maybe need to update the hight menu item here
			enyo.Signals.send("onMenuAccrodionUpdate");
		}
	},
	// *@private indicates if we need to refresh left dock categories.
	ifRefreshDockCategories: function (configData) {
		var lastedDockLevelConfig = Master.view.frame.getCurrentCategoryDockConfig() || {
			parentId: 0,
			level: 0
		};
		if (lastedDockLevelConfig.level == configData.level) {
			return false;
		}
		return true;
	}
});