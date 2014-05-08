/**
 * Master.views.home.Index view.
 * @extends Master.View
 */
enyo.kind({
	name: "Master.views.home.Index",
	kind: "Master.View",
	events:{
		"onGetAllCategories": ""
	},
	components:[
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")}
	],
	// only for testing purpose for view dispatch event to corresponding controller and then bubble it to Master.view.frame
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// this.doGetAllCategories({name:'xxxtest'});
		};	
	}),
	viewReady: function (){
		
	},
	// show category detail page.
	showCategoryDetailPage: function (viewModel, viewData) {

	}
});