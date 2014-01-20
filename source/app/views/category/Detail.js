enyo.kind({
	name: "Master.views.category.Detail",
	kind: "Master.View",
	classes:"api-details",
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name: "detailcontainer", showing: false, components: [
			{content:Master.locale.get("API_DESCRIPTION","title"), classes:"title"},
			{name:"description", allowHtml: true, classes:"description"}
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
	showCategoryDetailUI: function (viewModel, data){
		this.$.message.hide();
		var desc = viewModel.get("description") || "暂时没有描述数据！";
		// description.
		this.$.description.setContent(desc || "");
		this.$.detailcontainer.show();
	}
})