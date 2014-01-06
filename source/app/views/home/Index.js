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
	content: Master.locale.get("LOAD_CATEGORIES", "message"),
	receiveMessage: enyo.inherit(function(sup) {
		return function (viewModel, viewAction) {
			sup.apply(this, arguments);
			// do nothing now..
			var viewActionFn = viewAction && this[viewAction];
			if (viewActionFn) {
				viewActionFn.call(this, viewModel);
			} else {
				this.zWarn("viewActonFn don't exist!");
			}
		}
	}),
	// show categories.
	showUICategories: function (viewModel) {
		this.zLog("show categories view model: ", viewModel);
		this.destroyClientControls();
		var records = viewModel.records;
		this.createClientComponents([{ kind: "widgets.lists.TreeNodes", source: records }]);
		this.render();
	}
});