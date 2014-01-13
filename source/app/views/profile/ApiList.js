enyo.kind({
	name: "Master.views.profile.ApiList",
	kind: "Master.View",
	classes: "api-list",
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_API_LIST", "message")},
		{name:"apiList", kind: "List", showing: false, mutiSelect: false, onSetupItem: "apiListSetupItem", components: [
			{name: "item", classes:"list-item", tag: "ul", ontap:"itemTap", components: [
				{name:"apiId", tag:"li", classes: "id"},
				{name:"apiName", tag:"li", classes: "name"},
				{name:"apiKey", tag:"li", classes: "key"},
				{tag:"li", action:"addnew", classes: "add-new", content:Master.locale.get("ACTION_ADD", "label")},
				{tag:"li", action:"edit", classes: "edit", content:Master.locale.get("ACTION_EDIT", "label")},
				{tag:"li", action:"remove", classes: "remove", content:Master.locale.get("ACTION_REMOVE", "label")}
			]}
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
	showApiListUI: function (viewModel, data){
		this.zLog("viewModel: ", viewModel,"data: ", data);
		this.cachedAPIList = viewModel.records;
		this.$.apiList.setCount(this.cachedAPIList.length);
		this.$.apiList.reset();
		this.$.message.hide();
		this.$.apiList.show();
	},
	apiListSetupItem: function (inSender,inEvent) {
		var index = inEvent.index;
		var currItem = this.cachedAPIList[index];
		this.$.apiId.setContent(currItem.apiId);
		this.$.apiName.setContent(currItem.apiName);
		this.$.apiKey.setContent(currItem.apiKey);
		this.$.item.setShowing(currItem.isDisplay);
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
			location = "profile/api/edit/"+ currItem.apiId
			break;
			case "remove":
			location = "profile/api/remove/"+ currItem.apiId
			break;
		}
		if (location) {
			this.location(location);
		}
		return true;
	}
}); 