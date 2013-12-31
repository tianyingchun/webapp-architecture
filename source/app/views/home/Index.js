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
		{ tag: "div", classes: "home-index", components: [
			{ tag: "div", content:"home index view"},
			{ components: [
				{ kind: "Button", name:"allcategories", content:"Get All Categories", ontap:"getAllCategories"},
				{ kind: "Button", name:"categorydetail", content:"Get CategoryDetail", ontap:"getCategoryDetail"}	
			]}
		]}
	],
	receiveMessage: function (viewModel) {
		var restInfo = viewModel.restInfo;
		if (restInfo.retCode ==1) {
			// do nothing now..
			// 
		} else {	
			alert(restInfo.retMessage);
		}
	},
	// Get all categories from controller.
	getAllCategories: function (inSender, inEvent) {
		this.zLog("dispatch get all categories event to controller...");
		this.doGetAllCategories();
		return true;
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