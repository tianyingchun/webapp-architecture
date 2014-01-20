enyo.kind({
	name: "Master.controllers.CategoryController",
	kind: "Master.Controller",
	mixins:[
		//Note we have bindinged view and controller mapping for leftdock view. so 
		//if we need to render main content we need use event bubble to update.
		"Master.controllers.DockSupport"
	],
	_contentCategoryDetailKindView:"category.Detail",

	detail: function (key) {
		this.zLog("category detail key: ", key);
		this.showDockCategories({apiKey: key});
		// show category detail information.
		this.getCategoryDetailInfo(key);
		
	},
	getCategoryDetailInfo: function (key) {
		// show this view.
		this.bindingViewToContent(this._contentCategoryDetailKindView, null , null);
		var categoryModel = new Master.models.apipool.CategoryItem();
		var viewData = {
			action: "showCategoryDetailUI", 
			data: {
				key: key
			}
		};
		categoryModel.getCategoryDetail(key, this.bindSafely("_showCategoryDetail", viewData));
	},
	_showCategoryDetail: function (viewData, viewModel) {
		this.notifyView(this._contentCategoryDetailKindView, viewModel, viewData);
	},
	//@* public show categories on left dock
	showDockCategories: function (extraData) {
		Master.view.frame.hideSDKPanel();
		if (!Master.view.frame.hasCategoryContentsIndock()) {
			// maybe async fetch data here.
			this.getAllCategories(extraData);
		}
	}
});