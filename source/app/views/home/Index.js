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
	receiveMessage: enyo.inherit(function(sup) {
		return function (viewModel, viewData) {
			sup.apply(this, arguments);
			// do nothing now..
			var viewAction  = viewData.action;
			var extraData = viewData.data;
			var viewActionFn = viewAction && this[viewAction];
			if (viewActionFn) {
				viewActionFn.call(this, viewModel, extraData);
			} else {
				this.zWarn("viewActionFn don't exist!");
			}
		}
	}),
	// show category detail page.
	showCategoryDetailPage: function (viewModel, viewData) {

	}
});