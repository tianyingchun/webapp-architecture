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
	_detailViewKindName: "api.Node",

	mixins:[
		//Note we have bindinged view and controller mapping for leftdock view. so 
		//if we need to render main content we need use event bubble to update.
		"Master.controllers.DockSupport"
	],
	// default action :/node/api
	index: function (apiKey){
		this.zLog("apiKey: ", apiKey);
		// show left dock categories.
		this.node(apiKey, null);
	},
	/**
	 * Action: node,
	 * mapping: { path: "node/:api/:language", controller: "ApiController", action: "node"}
	 */
	node: function (apiKey, language) {
		this.zLog("apiKey: ", apiKey, " ,language:", language);
		language = language || this.defaultLanguage;
		//save current user selected language.
		this.saveUserApiLanguage(language);
		// show left dock categories if not.
		this.showDockCategories({apiKey: apiKey});

		// fetch category details information here.
		this.fetchCategoryDetailInfo(apiKey, language);
	},
	fetchCategoryDetailInfo: function (apiKey, language) {
		// binding view,
		this.bindingViewToContent(this._detailViewKindName, null, null);

		var apiDetail = new Master.models.apipool.CategoryItem();
		// view data.
		var viewData = {
			action: "showCategoryDetailPage", 
			data: {
				apiKey: apiKey,
				language: language
			}
		};
		apiDetail.getCategoryDetail(apiKey, enyo.bindSafely(this, "showCategoryDetailInfo", viewData));
		// binding view.
	},
	showCategoryDetailInfo: function (viewData, viewModel) {
		// this.zLog("categoryDetail: ", viewData, viewModel);
		this.notifyView(this._detailViewKindName, viewModel, viewData);
	},
	//@* public show categories on left dock
	showDockCategories: function (extraData) {
		if (!Master.view.frame.hasCategoryContentsIndock()) {
			// maybe async fetch data here.
			this.getAllCategories(extraData);
		}
	}
});