enyo.kind({
	name: "Master.views.profile.ApiNew",
	kind: "Master.View",
	classes: "api-new",
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"textEditor", kind: "Master.TextEditor"}
		]}
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
	showAddNewApiUI: function () {
		this.$.textEditor.markItUp();
		// this.$.textEditor.setValue("add new api content .....");
	}
});