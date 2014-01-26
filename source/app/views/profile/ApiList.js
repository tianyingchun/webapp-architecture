enyo.kind({
	name: "Master.views.profile.ApiList",
	kind: "Master.View",
	classes: "api-list",
	events:{
		onDeleteApiItem:""
	},
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_API_LIST", "message")},
		{kind:"onyx.Groupbox", name:"listWrapper", showing:false, components: [
			{kind: "onyx.GroupboxHeader", components:[
				{content:"API列表", classes:"list-title"},
				{content:"添加",kind:"onyx.Button", classes:"add-new-button", ontap:"addNewApi"}
			]},
			{name:"apiList", kind: "List", mutiSelect: false, onSetupItem: "apiListSetupItem", components: [
				{name: "item", classes:"list-item", tag: "ul", ontap:"itemTap", components: [
					{name:"apiId", tag:"li", classes: "id"},
					{name:"apiName", tag:"li", classes: "name"},
					{name:"apiKey", tag:"li", classes: "key"},
					{tag:"li", action:"addnew", classes: "add-new", content:Master.locale.get("ACTION_ADD", "label")},
					{tag:"li", action:"edit", classes: "edit", content:Master.locale.get("ACTION_EDIT", "label")},
					{tag:"li", action:"remove", classes: "remove", content:Master.locale.get("ACTION_REMOVE", "label")}
				]}
			]}
		]}
	],
	showApiListUI: function (viewModel, data){
		this.zLog("viewModel: ", viewModel,"data: ", data);
		this.cachedAPIList = viewModel.records;
		this.$.apiList.setCount(this.cachedAPIList.length);
		this.$.apiList.reset();
		this.$.message.hide();
		this.$.listWrapper.show();
	},
	apiListSetupItem: function (inSender,inEvent) {
		var index = inEvent.index;
		var currItem = this.cachedAPIList[index];
		this.$.apiId.setContent(currItem.apiId);
		this.$.apiName.setContent(currItem.apiName);
		this.$.apiKey.setContent(currItem.apiKey);
		this.$.item.setShowing(currItem.isDisplay);
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
	itemTap: function (inSender, inEvent) {
		// this.zLog("originator: ", inEvent);
		var originator = inEvent.originator;
		var index = inEvent.index;
		var currItem = this.cachedAPIList[index];
		var location = "";
		switch(originator.action) {
			case "addnew":
			location = "profile/api/add";
			break;
			case "edit":
			location = "profile/api/edit/"+ currItem.apiKey
			break;
			case "remove":
				this.confirmDeleteApiItem(currItem.apiId, currItem.apiKey, currItem.apiName);
			break;
		}
		if (location) {
			this.location(location);
		}
		return true;
	}
}); 