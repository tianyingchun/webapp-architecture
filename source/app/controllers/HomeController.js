/**
 * controllers namespace start Master.controllers.xxxController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.HomeController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport"
	],
	handlers: {
		// only for testing purpose for view dispatch event to corresponding controller and then bubble it to Master.view.frame
		onGetAllCategories: "getAllCategoriesTest"
	},
	// detial view kind name.
	_detailViewKindName: "home.Index",
	/**
	 * Action method
	 * @method 
	 */
	index: function () {
		// fetch all categories from server and show it on the left dock.
		// force refresh categories shown on left dock.
		this.getAllCategories();

		// show default category detail information in main content.
		
		// fetch category details information here.
		this.fetchCategoryDetailInfo();
	},
	fetchCategoryDetailInfo: function (apiKey) {
		// binding view,
		this.bindingViewToContent(this._detailViewKindName, null, null);

		var apiDetail = new Master.models.apipool.CategoryItem();
		apiDetail.getCategoryDetail(apiKey, enyo.bindSafely(this, "showCategoryDetailInfo", {action: "showCategoryDetailPage"}));
		// binding view.
	},
	showCategoryDetailInfo: function (viewData, viewModel) {
		// this.zLog("categoryDetail: ", viewData, viewModel);
		this.notifyView(this._detailViewKindName, viewModel, viewData);
	},
	getAllCategoriesTest: function (inSender, inEvent) {
		this.zLog("get all getAllCategories...", inEvent);
		return true;
	}
});