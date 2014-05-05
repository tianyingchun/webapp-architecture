enyo.kind({
	name: "Master.views.profile.ApiEdit",
	kind: "Master.View",
	classes: "api-edit",
	events:{
		// get all available categories.
		"onFetchApiAvailableCategories":"",
		// save api information to server.
		"onSaveApiInformation":""
	},
	handlers:{
		"onSectionChanged":"sectionManagerViewChangeHandler",
		"onTreeNodeClick":"treeNodeClick",
		"onTreeNodeExpandChanged":"treeNodeExpandChanged"
	},
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", submitButtonStyles:"btn btn-primary",submitButtonText:"确认修改", onValidationComplete:"formValidationSubmit", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "文档基本信息"},
					{classes:"form-item", components:[
						{ classes:"title", content:"文档 KEY"},
						{ name:"api_key", placeholder:"文档 KEY", ajax:"checkifKeyExist", kind:"widgets.forms.InputDecorator", tipMessage:"全局唯一，请一定输入不重复的KEY限英文字母", validation: {required:"必填字段！",hash:""}}
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
						{ name:"showCategoryDialogBtn", kind:"enyo.Button", classes:"btn", content:"--请选择API分类--", ontap:"showCategoryTreeDialog"},
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
			]}
		]}
	],
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.$.api_description.markItUp();
		};
	}),
	loadingExistApiDetailUI: function (viewModel, data){
		this.writeApiDetailInformation(viewModel, data.spinner_uid);
		this.initSectionManager(viewModel.get("section"));
	},
	formValidationSubmit: function (inSender, inEvent) {
		var validationResult = inEvent;
		this.zLog("form validation result", validationResult);
		// success/failed.
		if (validationResult.status =="success") {
			var  apiDetail = this.readApiDetailInformation();
			this.doSaveApiInformation({data: apiDetail, editModel: true});
		}
		// stop  bubble.
		return true;
	},
	writeApiDetailInformation: function (viewModel,spinner_uid) {
		// current selected key.
		this.__selectedCategoryKey = viewModel.get("parentId");
		this._id = viewModel.get("id");
		this.$.api_key.setValue(viewModel.get("key"));
		this.$.api_name.setValue(viewModel.get('name'));
		this.$.api_display_order.setValue(viewModel.get("displayOrder")||0);
		this.$.api_is_expanded.setValue(viewModel.get("expanded")|| 0);
		this.$.api_is_display.setValue(viewModel.get("isDisplay") || 0);
		this.$.api_description.setEditorContent(viewModel.get("description"));
		var parent = viewModel.get("parent") || {};
		if (parent.name) {
			this.$.showCategoryDialogBtn.setContent(parent.name);
		}

		// hide loading spinner.
		Master.view.frame.hideSpinnerPopup(spinner_uid);
	},
	//@private for get prepared api detail information.
	readApiDetailInformation: function () {
		var _data = {};
		// selecte category
		_data.key = this.$.api_key.getValue();
		_data.name = this.$.api_name.getValue();
		_data.expaned = this.$.api_is_expanded.getValue();
		_data.isDisplay = this.$.api_is_display.getValue();
		_data.displayOrder = this.$.api_display_order.getValue();
		_data.description = this.$.api_description.getEditorContent();
		_data.parentId = this.__selectedCategoryKey || 0;
		_data.id = this._id;
		// sections  array.
		_data.section = this.$.sectionManager.getResult() || [];

		return _data;
	},
	initSectionManager: function (section) {
		// section  = [
		// 	{controlName:"textEditor", sectionTitle:"text edit demo title111", source:'test data html code it is html string<pre><code  class ="lang-json">[{"title":"apples","count":[12000,20000],"description":{"text":"...","sensitive":false}},{"title":"oranges","count":[17500,null],"description":{"text":"...","sensitive":false}}]</code></pre>'},
		// 	{controlName:"table", sectionTitle:"table section title", source:[
		// 		["Header","header1","header2","header3","header4"],
		//  		["10","11","12","13","<a href='#'>14 download link</a>"],
		//  		["20","21","22","23","24"]
		// 	]},
		// 	{controlName:"linkList", sectionTitle:"link list title", source:[
		// 		{href:"http://www.1qianbao.com", target:"_blank", linkIcon: "https", text:"alipay.micropay.order.direct.pay",  description:"单笔直接支付"},
		// 		{href:"http://www.1qianbao.com", target:"_self", linkIcon: "http", text:"alipay.micropay.order.freezepayurl.get", description:"查询冻结金支付地址"},
		// 		{href:"http://www.1qianbao.com", target:"_blank", linkIcon: "https", text:"alipay.micropay.order.confirmpayurl.get",  description:"查询单笔有密支付地址"},
		// 		{href:"http://www.1qianbao.com", target:"_self", linkIcon: "http", text:"alipay.micropay.order.get", description:"查询冻结订单详情"}
		// 	]}
		// ];
		// for testing purpose.
		this.$.sectionManager.set("sections", section||[]);
	},
	sectionManagerViewChangeHandler: function (inSender, inEvent) {
		Master.view.frame.notifyTwoColumnLayoutReflow();
		return true;
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
		this.$.showCategoryDialogBtn.setContent(selectedNode.get("content"));
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
	}
});