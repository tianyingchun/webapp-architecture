enyo.kind({
	name: "Master.views.api.Search",
	kind: "Master.View",
	classes:"api-search-result",
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name:"docList", kind:"widgets.lists.PagedListView",
			showPager:true, 
			itemClickKeyProperty: "actionTapPropIndicator",
			itemDataTemplate:"listViewItemConverter"
		},
		{name:"empty",tag:"h5",content:"对不起，没有搜索到你想要的内容!", showing:false}
	],
	itemNumberMapping: {
		"0":"结果一. ",
		"1":"结果二. ",
		"2":"结果三. ",
		"3":"结果四. ",
		"4":"结果五. ",
		"5":"结果六. ",
		"6":"结果七. ",
		"7":"结果八. ",
		"8":"结果九. ",
		"9":"结果十. "
	},
	events: {
		"onSearchPagedChanged":""
	},
	handlers: {
		"onRenderComplete":"listViewRendered",
		"onRowItemClick":"listViewRowItemClick",
		"onPageClick": "pageNumberClick"
	},
	//*@override Master.View
	viewReady: function () {
		this.$.message.show();
		this.$.docList.hide();
		this.$.empty.hide();
	},
	showApiListUI: function(viewModel, viewData) {
		this.zLog("viewModel", viewModel, viewData);
		// save query text.
		this.query = viewData.query || {text:""};
		var $docList = this.$.docList;
		var total = viewModel.get("total");
		if (total) {
			$docList.set("recordsTotal", total);
			$docList.set("pageIndex", viewData.pageIndex);
			$docList.set("pageSize", viewData.pageSize);
			$docList.set("pagerUri","#home");
			$docList.set("source", viewModel.get("list")|| []);
		} else {
			this.$.empty.show();
			this.$.message.hide();
		}
	}, 
	listViewItemConverter: function (item, index) {
		// update doc table list page uri
		var _new = {
			classes:"item",
			key: item.key,
			components: [
				{classes:"header", key:item.key, tag:"h4",actionTapPropIndicator:"__headertap", ontap:"listViewRowItemClick", components: [
					{tag:"span",content: this.itemNumberMapping[index]},
					{tag:"span", content: item.name}
				]},
				{classes:"desc", content:item.description, allowHtml: true}
			]
		};
		return _new;
	},
	listViewRendered: function (inSender, inEvent) {
		this.$.message.hide();
		this.$.docList.show();
		return true;
	},
	pageNumberClick: function (inSender,inEvent) {
		var pageNumber = inEvent.pageNumber;
		var pageSize = inEvent.pageSize;
		this.doSearchPagedChanged({
			pageIndex: pageNumber,
			pageSize: pageSize, 
			query : this.query
		});
		return true;
	},
	listViewRowItemClick: function (inSender, inEvent) { 
		var key = inEvent.key;
		if (key) {
			window.location.href = "#node/"+key;
		}
		return true;
	}
});