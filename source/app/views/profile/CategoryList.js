enyo.kind({
	name: "Master.views.profile.CategoryList",
	kind: "Master.View",
	classes: "category-list",
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORIES", "message")},
		{kind:"onyx.Groupbox", name:"listWrapper", showing:false, components: [
			{kind: "onyx.GroupboxHeader", components:[
				{content:"分类列表", classes:"list-title"},
				{content:"添加",kind:"onyx.Button", classes:"add-new-button", ontap:"addNewCategory"}
			]},
			{name:"categoryList", kind: "List", mutiSelect: false, onSetupItem: "categoryListSetupItem", components: [
				{name: "item", classes:"list-item", tag: "ul", ontap:"itemTap", components: [
					{name:"categoryId", tag:"li", classes: "id"},
					{name:"categoryName", tag:"li", classes: "name"},
					{name:"categoryKey", tag:"li", classes: "key"},
					{tag:"li", action:"addnew", classes: "add-new", content:Master.locale.get("ACTION_ADD", "label")},
					{tag:"li", action:"edit", classes: "edit", content:Master.locale.get("ACTION_EDIT", "label")},
					{tag:"li", action:"remove", classes: "remove", content:Master.locale.get("ACTION_REMOVE", "label")}
				]}
			]}
		]}
	],
	/**
	 * Show categories
	 */
	showCategoriesUI: function (viewModel, data) {
		this.zLog("viewModel: ", viewModel,"data: ", data);
		// categories source converter.
		var _records = viewModel.records;
		this.cachedCategoryList = _records;
		this.$.categoryList.setCount(this.cachedCategoryList.length);
		this.$.categoryList.reset();
		this.$.message.hide();
		this.$.listWrapper.show();
	},
	categoryListSetupItem: function (inSender, inEvent) {
		var index = inEvent.index;
		var currItem = this.cachedCategoryList[index];
		this.$.categoryId.setContent(currItem.categoryId);
		this.$.categoryName.setContent(currItem.categoryName);
		this.$.categoryKey.setContent(currItem.categoryKey);
		// this.$.item.setShowing(currItem.isDisplay);
	},
	addNewCategory: function (inSender,inEvent) {
		this.location("profile/category/add");
		return true;
	},
	itemTap: function (inSender, inEvent) {
		// this.zLog("originator: ", inEvent);
		var originator = inEvent.originator;
		var index = inEvent.index;
		var currItem = this.cachedCategoryList[index];
		var location = "";
		switch(originator.action) {
			case "addnew":
			location = "profile/category/add";
			break;
			case "edit":
			location = "profile/category/edit/"+ currItem.categoryKey
			break;
			case "remove":
			location = "profile/category/remove/"+ currItem.categoryKey
			break;
		}
		if (location) {
			this.location(location);
		}
		return true;
	}
});