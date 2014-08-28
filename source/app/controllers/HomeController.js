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
		// detial view kind name.
		API_DETAIL_PAGE: "api.Detail"
	},
	/**
	 * Action method
	 * @method 
	 */
	index: function () {
		// fetch all categories from server and show it on the left dock.
		// force refresh categories shown on left dock.
		this.getCategorySiblingsAndChilds({
			parentId: 0,
			level: 0,
			callback: this.bind("fetchDefaultApiDetailInfo")
		});
	},
	fetchDefaultApiDetailInfo: function (viewModel) {
 		var apiDetail = viewModel.records[0] || null;
 		//apiModel =  new Master.models.apipool.ApiItem();
 		var apiModel = this.getModelInstance("Master.models.apipool.ApiItem", {id:apiDetail.id});
		apiModel.setObject(apiDetail);
		var viewData = {
			action: "showApiDetailUI"
		};
		// binding view direct.
		this.bindingViewToContent(this.API_DETAIL_PAGE, apiModel, viewData);
	}
});