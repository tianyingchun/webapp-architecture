enyo.kind({
	name: "Master.views.profile.ApiList",
	kind: "Master.View",
	classes: "api-detail-list-wrapper",
	events:{
		"onFetchApiAvailableCategories":""
	},
	handlers:{
		"onTabIndexChanged":"tabIndexChangdHandler",
		"onFetchCategoryTree":"fetchApiAvailableCategories"
	},
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_API_LIST", "message")},
		{name:"simpletab", showing: false, kind:"widgets.custom.SimpleTabs", classes:"header-container",
			headerComponents: [
				{content:"文档信息"},
	        	{content:"子文档列表"}
			],
			contentComponents:[
				{ name:"editPanel", kind:"Master.views.controls.ApiEditPanel"},
				{ name:"childList", kind:"Master.views.controls.ApiChildListPanel"}
			]
		}
	],
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.init();
		};
	}),
	//*@override before view render or re-render phase.
	viewReady: function (){
		 this.$.message.show();
		 this.$.simpletab.hide();
	},
	init: function () {
		// initialize
		var $simpleTab = this.$.simpletab;
		this.$$childList = $simpleTab.findControlByName("childList");
		this.$$editPanel = $simpleTab.findControlByName("editPanel");
	},
	showApiListUI: function (viewModel, data){
		this.zLog("viewModel: ", viewModel,"data: ", data);
		// show api detail tab information
		this.showApiDetailTabInfo(viewModel);
		// show cache api child list item.
		this.cachedAPIList = viewModel.get("children") || [];

		if (this.cachedAPIList.length) {
			this.$$childList.set("parentId", viewModel.get("id"));
			// update doc table list page uri
			this.$$childList.set("pagerUri","#profile/node/list/"+viewModel.get("id"));
			// $docList.set("recordsTotal", 0);
			this.$$childList.set("source",this.cachedAPIList);
		} else {
			// hide tab header
			this.$.simpletab.hideTabHeader();
		}
		this.$.message.hide();
		this.$.simpletab.show();
	},
	fetchApiAvailableCategories: function (inSender, inEvent) {
		// goto fetch availble categories tree.
		var config = {
			viewPage: "api",
			viewKind: "profile.ApiList",
			editModel: true
		};
		this.bubble("onFetchApiAvailableCategories", config);
		return true;
	},
	showAvalilableCategories: function (viewModel) {
		this.$$editPanel.set("categoriesViewModel", viewModel);
	},
	showApiDetailTabInfo: function (viewModel) {
		var $simpleTab = this.$.simpletab;
		var $editPanel = $simpleTab.findControlByName("editPanel");
		$editPanel.set("viewModel", viewModel);
	},
	// while 
	tabIndexChangdHandler: function (inSender, inEvent) {
		Master.view.frame.notifyTwoColumnLayoutReflow(100);
		return true;
	}
}); 