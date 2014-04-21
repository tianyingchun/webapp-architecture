enyo.kind({
	name: "Master.views.profile.CategoryList",
	kind: "Master.View",
	classes: "list-wrapper",
	events:{
		"onDeleteCategoryItem": ""
	},
	handlers:{
		onActionButtonTap:"rowActionButtonTap"
	},
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORIES", "message")},
		{kind:"onyx.Groupbox", name:"listWrapper", showing:false, components: [
			{classes:"list-header", components:[
				{content:"分类列表", classes:"list-title"},
				{tag:"a", classes:"btn",ontap:"addNewCategory", components:[
					{tag:"i", classes:"icon-plus"},
					{tag:"span",content:"添加"}
				]}
			]},
			{   name:"categoryList", kind:"widgets.lists.PagedList",
				rowKeyField:"categoryKey", 
				fields: ['categoryId','categoryName','categoryKey'],
				header: ["分类ID","分类名称","分类Hash","操作"]
			} 
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
		this.$.categoryList.set("pagerUri","#profile/category/list");
		this.$.categoryList.set("source",this.cachedCategoryList);
		this.$.message.hide();
		this.$.listWrapper.show();
	},
	addNewCategory: function (inSender,inEvent) {
		this.location("profile/category/add");
		return true;
	},
	confirmCategoryItem: function (categoryId, categoryKey, categoryName) {
		Master.view.frame.showConfirmDialog({
			title: "确认",
			message: "确认要删除分类'"+ categoryName+"'吗？",
			success: this.bindSafely("deleteCategoryItem", categoryId, categoryKey)
		});
	},
	deleteCategoryItem: function (categoryId, categoryKey) {
		this.doDeleteCategoryItem({categoryId: categoryId,categoryKey:categoryKey});
	},
	//*@private helper.
	findRowItemData: function(categoryKey) {
		var find = null;
		for (var i = 0; i < this.cachedCategoryList.length; i++) {
			var item = this.cachedCategoryList[i];
			if(item.categoryKey==categoryKey) {
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
				location = "profile/category/add";
				break;
			case "edit":
				location = "profile/category/edit/"+ key;
				break;
			case "remove":
				var currItem = this.findRowItemData(key);
				this.confirmCategoryItem(currItem.categoryId, currItem.categoryKey, currItem.categoryName);
				break; 
		}
		if (location) {
			this.location(location);
		}
		return true;
	}
});