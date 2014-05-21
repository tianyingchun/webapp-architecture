enyo.kind({
	name: "Master.views.api.Search",
	kind: "Master.View",
	classes:"api-search-result",
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name:"docList", showPager:true, 
			kind:"widgets.lists.PagedListView",
			itemDataTemplate:"listViewItemConverter"
		}
	],
	handlers: {
		"onRenderComplete":"listViewRendered",
		"onRowItemClick":"listViewRowItemClick"
	},
	//*@override Master.View
	viewReady: function () {
		this.$.message.show();
		this.$.docList.hide();
	},
	showApiListUI: function(viewModel, viewData) {
		this.zLog("viewModel", viewModel, viewData);
		var $docList = this.$.docList;
		$docList.set("recordsTotal", viewModel.get("total"));
		$docList.set("pageIndex", viewData.pageIndex);
		$docList.set("pageSize", viewData.pageSize);
		$docList.set("pagerUri","#home");
		$docList.set("source", viewModel.get("list")|| []);
	},
	listViewItemConverter: function (item) {
		// update doc table list page uri
		var _new = {
			classes:"item",
			key: item.id,
			components: [
				{classes:"header" , content: item.name},
				{classes:"desc", content:item.description}
			]
		};
		return _new;
	},
	listViewRendered: function (inSender, inEvent) {
		this.$.message.hide();
		this.$.docList.show();
		return true;
	},
	listViewRowItemClick: function (inSender, inEvent) {

		return true;
	}
});