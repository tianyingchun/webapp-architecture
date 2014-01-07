enyo.kind({
	name: "Master.views.api.Index",
	kind: "Master.View",
	content: Master.locale.get("LOAD_CATEGORIES", "message"),
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
	})
});