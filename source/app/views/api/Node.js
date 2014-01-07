enyo.kind({
	name: "Master.views.api.Node",
	kind: "Master.View",
	content: Master.locale.get("LOAD_CATEGORY_DETAIL", "message"),
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
	showCategoryDetailPage: function (viewModel) {
		this.zLog("viewModel", viewModel);	
	}
});