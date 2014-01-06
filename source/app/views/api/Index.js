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
	}),
	// show categories in left dock if we directly enter specific api page.
	// e.g. http://localhost:8000/debug.html#node/bravo-a/java
	showUICategories: function (viewModel, viewData) {
		this.zLog("show categories view model: ", viewModel);
		this.destroyClientControls();
		var records = viewModel.records;
		var categoryKey = extraData && extraData.apiKey;

		this.createClientComponents([{ kind: "widgets.lists.TreeNodes", selectedKey:categoryKey, source: records }]);
		this.render();
	}
});