enyo.kind({
	name: "Master.views.profile.ApiList",
	kind: "Master.View",
	classes: "api-detail-list-wrapper",
	events:{
		onDeleteApiItem:""
	},
	handlers:{
		"onActionButtonTap":"rowActionButtonTap",
		"onTabIndexChanged":"tabIndexChangdHandler",
		"onSectionChanged":"sectionManagerViewChangeHandler",
		"onTreeNodeClick":"treeNodeClick",
		"onTreeNodeExpandChanged":"treeNodeExpandChanged",
		"ontap":"buttonsTapHandler"
	},
	components: [
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_API_LIST", "message")},
		{name:"simpletab", showing: false, kind:"widgets.custom.SimpleTabs", classes:"header-container",
		headerComponents: [
			{content:"文档信息"},
        	{content:"子文档列表"}
		],
		contentComponents:[
			{name:"form", submitButtonStyles:"btn btn-primary",submitButtonText:"确认修改", onValidationComplete:"formValidationSubmit", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "文档基本信息"},
					{classes:"form-item", components:[
						{ classes:"title", content:"文档 KEY"},
						{ name:"api_key", placeholder:"文档 KEY", kind:"widgets.forms.InputDecorator", tipMessage:"全局唯一，请一定输入不重复的KEY限英文字母", validation: {required:"必填字段！",hash:""}}
					]},
					// document name.
					{classes:"form-item", components:[
						{ classes:"title", content:"文档名称"},
						{ name:"api_name", placeholder:"API名称", kind:"widgets.forms.InputDecorator", tipMessage:"文档名称必须填写！", validation: {required:"必填字段！"}}
					]},
					// document display order.
					{classes:"form-item", components:[
						{ classes:"title", content:"文档排序"},
						{name:"api_display_order", value:0, placeholder:"API名称", type:"number", kind:"widgets.forms.InputDecorator", tipMessage:"填写分类排序，数字值越小显示越靠前!", validation: {required:"请输入数字!", number:""}}
					]},
					// indicates document if need expanded
					{classes:"form-item", components:[
						{ classes:"title", content:"是否展开"},
						{name:"api_is_expanded", kind:"onyx.Checkbox"}
					]},
					// indicates document if need display
					{classes:"form-item", components:[
						{ classes:"title", content:"是否显示"},
						{name:"api_is_display", kind:"onyx.Checkbox"}
					]},
					// which categorye document belongs to .
					{classes:"form-item", components:[
						{ classes:"title", content:"文档分类"},
						{ name:"showCategoryDialogBtn", action:"showCategories", kind:"enyo.Button", classes:"btn", content:"--请选择API分类--"},
					]}
				]}, 
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "文档概述"},
					// api descriptons. text editor.
					{name:"api_description", kind: "Master.TextEditor"}		
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "片段(Section)管理"},
					{classes:"form-item", components:[
						{name:"sectionManager", kind: "widgets.section.SectionManager", model:"edit"}
					]}
				]}
			]},
			{kind:"onyx.Groupbox", name:"listWrapper", components: [
				{classes:"list-header", components:[
					{content:"文档列表", classes:"list-title"},
					{tag:"a", classes:"btn", action:"addNewApi", components:[
						{tag:"i", classes:"icon-plus"},
						{tag:"span",content:"添加"}
					]}
				]},
				{ 	name:"docList", showPager:false, kind:"widgets.lists.PagedList",
					rowKeyField:"id",
					fields: ['id','name','key'],
					header: ['文档ID','文档名称','文档Hash','操作']
				}
			]}
		]}
	],
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.init();
		};
	}),
	init: function () {
		var $simpleTab = this.$.simpletab;
		var $api_description = $simpleTab.findControlByName("api_description");
		$api_description.markItUp();
	},
	showApiListUI: function (viewModel, data){
		this.zLog("viewModel: ", viewModel,"data: ", data);
		// show api detail tab information
		this.showApiDetailTabInfo(viewModel);

		// show cache api child list item.
		this.cachedAPIList = viewModel.get("children") || [];
		var $docList = this.$.simpletab.findControlByName("docList");
		// update doc table list page uri
		$docList.set("pagerUri","#profile/node/list"+viewModel.get("id"));
		// $docList.set("recordsTotal", 0);
		$docList.set("source",this.cachedAPIList);
		this.$.message.hide();
		this.$.simpletab.show();
	},
	showApiDetailTabInfo: function (viewModel) {
		var $simpleTab = this.$.simpletab;
		this.__selectedCategoryKey = viewModel.get("parentId");
		this._id = viewModel.get("id");
		$simpleTab.findControlByName("api_key").setValue(viewModel.get("key"));
		$simpleTab.findControlByName("api_name").setValue(viewModel.get('name'));
		$simpleTab.findControlByName("api_display_order").setValue(viewModel.get("displayOrder")||0);
		$simpleTab.findControlByName("api_is_expanded").setValue(viewModel.get("expanded")|| 0);
		$simpleTab.findControlByName("api_is_display").setValue(viewModel.get("isDisplay") || 0);
		$simpleTab.findControlByName("api_description").setEditorContent(viewModel.get("description"));
		var parent = viewModel.get("parent") || {};
		if (parent.name) {
			$simpleTab.findControlByName("showCategoryDialogBtn").setContent(parent.name);
		} else {
			$simpleTab.findControlByName("showCategoryDialogBtn").setContent("根节点");
		}
		this.initSectionManager(viewModel.get("section"));
	},
	initSectionManager: function (section) {
		var $simpleTab = this.$.simpletab;

		// for testing purpose.
		$simpleTab.findControlByName("sectionManager").set("sections", section||[]);
	},
	sectionManagerViewChangeHandler: function (inSender, inEvent) {
		Master.view.frame.notifyTwoColumnLayoutReflow();
		return true;
	},
	buttonsTapHandler: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		switch($originator.action) {
			case "addNewApi" :
				this.addNewApi();
			break;
			case "showCategories":
				this.showCategoryTreeDialog();
			break;
		}
	},
	/**
	 * For dialog tree node components.
	 */
	showCategoryTreeDialog: function (inSender, inEvent) {
		this.treeDialog = new widgets.dialog.TreeNodeDialog({
			style:"width: 500px; height: 300px;",title:"请选择所属分类",
			childNodeKey:"children",
			selectedItemKey:"_id",
			selectedItemValue:this.__selectedCategoryKey,// current unique key.
			success: this.bindSafely("treeDialogConfirm"),
			itemConverter: this._treeNodeConverter,
			bubbleTarget: this
		});
		
		this.treeDialog.show();
		// goto fetch availble categories tree.
		var config = {
			viewPage: "api",
			editModel: true
		};
		this.doFetchApiAvailableCategories(config);
		return true;
	},
	showAvalilableCategories: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		var records = viewModel.records; 
		// simulate the fetch tree nodes data from remote server.
		this.treeDialog && this.treeDialog.set("source", records);
	},
	//*@private each tree node category item date converter.
	_treeNodeConverter: function (item) {
		return {
			_id: item.id, content: item.name//// 不能用id.因为ENYO 里面组件查找是通过ID 来的容易照成冲突 非常重要。 所以在使用组建的时候一定不能用Id
		};
	},
	treeDialogConfirm: function (inEvent) {
		var selectedNode = inEvent.selectedNode;
		var $simpleTab = this.$.simpletab;

		$simpleTab.findControlByName("showCategoryDialogBtn").setContent(selectedNode.get("content"));
		this.__selectedCategoryKey = selectedNode.get("_id");
		this.zLog("new api category unique key: ", this.__selectedCategoryKey);
	},
	treeNodeClick: function (inSender, inEvent) {
		this.zLog(inEvent);
		return true;
	},
	treeNodeExpandChanged: function (inSender, inEvent) {
		this.zLog(inEvent);

		return true;
	},
	addNewApi: function (inSender,inEvent) {
		this.location("profile/node/new");
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
	findRowItemData: function(apiId) {
		var find = null;
		for (var i = 0; i < this.cachedAPIList.length; i++) {
			var item = this.cachedAPIList[i];
			if(item.id == apiId) {
				find = item;
				break;
			}
		};
		return find;
	},
	//*@action button tap handler.
	rowActionButtonTap: function (inSender, inEvent) {
		var action = inEvent.action;
		var apiId = inEvent.key;
		var location = "";
		var currItem = this.findRowItemData(apiId);	
		switch(action) {
			case "add":
				location = "profile/node/new";
				break;
			case "edit":
				location =currItem.children &&currItem.children.length? "profile/node/list/"+ apiId:"profile/node/"+apiId;
				break;
			case "remove":
				this.confirmDeleteApiItem(currItem.id, currItem.key, currItem.name);
				break; 
		}
		if (location) {
			this.location(location);
		}
		return true;
	},
	// while 
	tabIndexChangdHandler: function (inSender, inEvent) {
		Master.view.frame.notifyTwoColumnLayoutReflow(100);
		return true;
	}
}); 