/**
 * Master.views.home.Index view.
 * @extends Master.View
 */
enyo.kind({
	name: "Master.views.home.Index",
	kind: "Master.View",
	events:{
		"onGetAllCategories": "",
		"onGetCategoryDetail": ""
	},
	components: [
		{ kind: "widgets.lists.TreeNodes" }
	],
	receiveMessage: function (viewModel, viewAction) {
		var restInfo = viewModel.restInfo;
		if (restInfo.retCode ==1) {
			// do nothing now..
			var viewActionFn = viewAction && this[viewAction];
			if (viewActionFn) {
				viewActionFn.call(this, viewModel);
			}
		} else {	
			alert(restInfo.retMessage);
		}
	},
	// Get all categories from controller.
	getAllCategories: function (inSender, inEvent) {
		this.zLog("dispatch get all categories event to controller...");
		this.doGetAllCategories({viewAction:"showCategories"});
		return true;
	},
	// show categories.
	showCategories: function (viewModel) {
		this.zLog("show categories view model: ", viewModel);
	},
	// Get category detail.	
	getCategoryDetail: function (inSender, inEvent) {
		this.zLog("dispatch get category detail event to controller...");
		this.doGetCategoryDetail({categoryId: 1});
		return true;
	},
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// this.zLog("home index create: controller", this);
		};
	})
});