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
	constants: {
		//
	},
	/**
	 * Action method
	 * @method 
	 */
	index: function () {
		// fetch all categories from server and show it on the left dock.
		// force refresh categories shown on left dock.
		this.getAllCategories({
			callback: this.bind("fetchCategoryDetailInfo")
		});
	},

	fetchCategoryDetailInfo: function (viewModel) {
 		var apiDetail = viewModel.records[0] || null;
 		if (apiDetail) {
 			// now directly redirect to first api detail page.
 			this.zLog("apiDetail: ", apiDetail);
 			var apiKey = apiDetail.categoryKey;
 			
 			// now just redirect to first category item.
 			this.locationCategoryItem(apiKey);
 		}
		// binding view.
	}
});