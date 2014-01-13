enyo.kind({
	name: "Master.views.shared.DockCategories",
	kind: "Master.View",
	components:[
		{name:"message",kind:"widgets.base.Spinner",size:25, message: Master.locale.get("LOAD_CATEGORIES", "message")},
		{name:"dockTitle",showing:false, classes: "dock-title", content:Master.locale.get("API_CATALOG","title")},
		{name: "categoriesContainer", showing: false}
	],
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
	showUICategories: function (viewModel, extraData) {
		this.zLog("show categories view model: ", viewModel);
		this.destroyClientControls();
		var records = viewModel.records;
		var categoryKey = extraData && extraData.apiKey;

		this.$.categoriesContainer.createClientComponents([{ kind: "widgets.lists.TreeNodes",rootNodeText:"", selectedKey:categoryKey, source: records}]);
		this.$.categoriesContainer.render();
		// show categories, hide message.
		this.$.message.hide();
		this.$.dockTitle.show();
		this.$.categoriesContainer.show();
	}
});