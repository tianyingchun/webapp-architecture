enyo.kind({
	name: "Master.views.profile.ApiList",
	kind: "Master.View",
	classes: "list-wrapper",
	events:{
		onDeleteApiItem:""
	},
	handlers:{
		onActionButtonTap:"rowActionButtonTap"
	},
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_API_LIST", "message")},
		{kind:"onyx.Groupbox", name:"listWrapper", showing:false, components: [
			{classes:"list-header", components:[
				{content:"文档列表", classes:"list-title"},
				{tag:"a", classes:"btn",ontap:"addNewApi", components:[
					{tag:"i", classes:"icon-plus"},
					{tag:"span",content:"添加"}
				]}
			]},
			{	name:"docList", kind:"widgets.lists.PagedList",
				rowKeyField:"apiKey",
				fields: ['apiId','apiName','apiKey'],
				header: ['文档ID','文档名称','文档Hash','操作']
			}
		]}
	],
	showApiListUI: function (viewModel, data){
		this.zLog("viewModel: ", viewModel,"data: ", data);
		this.cachedAPIList = viewModel.records;
		// update doc table list page uri
		this.$.docList.set("pagerUri","#profile/api/list");
		this.$.docList.set("source",this.cachedAPIList);
		this.$.message.hide();
		this.$.listWrapper.show();
	},
	addNewApi: function (inSender,inEvent) {
		this.location("profile/api/add");
		return true;
	},
	confirmDeleteApiItem: function (apiId, apiKey, apiName) {
		Master.view.frame.showConfirmDialog({
			title: "确认",
			message: "确认要删除API'"+ apiName+"'吗？",
			success: this.bindSafely("deleteApiItem", apiId, apiKey)
		});
	},	
	deleteApiItem: function (apiId, apiKey) {
		this.doDeleteApiItem({apiId: apiId, apiKey: apiKey});
	},
	//*@private helper.
	findRowItemData: function(apiKey) {
		var find = null;
		for (var i = 0; i < this.cachedAPIList.length; i++) {
			var item = this.cachedAPIList[i];
			if(item.apiKey==apiKey) {
				find = item;
				break;
			}
		};
		return find;
	},
	//*@action button tap handler.
	rowActionButtonTap: function (inSender, inEvent) {
		var action = inEvent.action;
		var key = inEvent.key;
		var location = "";
		switch(action) {
			case "add":
				location = "profile/api/add";
				break;
			case "edit":
				location = "profile/api/edit/"+ key;
				break;
			case "remove":
				var currItem = this.findRowItemData(key);
				this.confirmDeleteApiItem(currItem.apiId, currItem.apiKey, currItem.apiName);
				break; 
		}
		if (location) {
			this.location(location);
		}
		return true;
	}
}); 