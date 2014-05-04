enyo.kind({
	name: "Master.views.profile.CategoryEdit",
	kind: "Master.View",
	classes: "category-edit",
	events:{
		"onCommitCategory":"",// cutomized event to controller.
		// get all available categories.
		"onFetchApiAvailableCategories":"",
		// save api information to server.
		"onSaveApiInformation":""
	},
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", submitButtonStyles:"btn btn-primary",submitButtonText:"保存更改", onValidationComplete:"formValidationSubmit", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "分类基本信息"},
					{classes:"form-item", components:[
						{ classes:"title", content:"分类KEY"},
						{ name:"category_key", placeholder:"分类KEY", kind:"widgets.forms.InputDecorator", tipMessage:"全局唯一，请一定输入不重复的KEY限英文字母", validation: {required:"必填字段！",hash:""}}
					]},
					{classes:"form-item", components:[
						{ classes:"title", content:"分类名称"}, 
						{ name:"category_name", placeholder:"分类名称", kind:"widgets.forms.InputDecorator", tipMessage:"分类名称必须填写！", validation: {required:"必填字段！"}}
					]},
					{classes:"form-item", components:[
						{ classes:"title", content:"默认展开"},  
						{ name:"category_expanded", kind:"onyx.Checkbox"}
					]},
					{classes:"form-item", components:[
						{ classes:"title", content:"显示顺序"},  
						{ name:"category_display_order", value:0, type:"number", kind: "widgets.forms.InputDecorator", tipMessage: "填写分类排序，只能为数字值越大优先级越高", validation: {required:"请输入数字!", number:""}}
					]},
					{classes:"form-item", components:[
						{ classes:"title", content:"是否显示"},  
						{ name:"category_display", kind:"onyx.Checkbox"}
					]},
					// which categorye document belongs to .
					{classes:"form-item", components:[
						{ classes:"title", content:"文档分类"},
						{ name:"showCategoryDialogBtn", kind:"enyo.Button", classes:"btn", content:"--请选择API分类--", ontap:"showCategoryTreeDialog"},
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "分类描述"},
					// api descriptons. text editor.
					{classes:"form-item nopd", components:[
						{name:"category_description", kind: "Master.TextEditor"}		
					]}
				]}				
			]}
		]}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.showLoading("Loading...");
			Master.view.frame.setDockContentTitle("编辑分类信息")
		};
	}),
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// make sure the dom is rendered.
			this.$.category_description.markItUp();
		};
	}),
	formValidationSubmit: function (inSender, inEvent) {
		var validationResult = inEvent;
		this.zLog("form validation result", validationResult);
		// success/failed.
		if (validationResult.status =="success") {
			this.updateCategoryInfo();
		}
		// stop  bubble.
		return true;
	},
	updateCategoryInfo:function () {
		var data = {
			categoryId: this._categoryId,
			categoryKey: this.$.category_key.getValue(),
			categoryName: this.$.category_name.getValue(),
			isExpanded: this.$.category_expanded.getValue(),
			isDisplay: this.$.category_display.getValue(),
			displayOrder: this.$.category_display_order.getValue(),
			description: this.$.category_description.getEditorContent()
		};
		this.doCommitCategory({data:data, isEditModel: true});
	},
	// show loading message.
	showLoading:function (message) {
		this._uid_category_info = Master.view.frame.showSpinnerPopup({
			classes:"white",
			message: message
		});
	},
	// show category data.
	showEditCategoryUI: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		this._categoryId = viewModel.get("categoryId");
		this.$.category_key.setValue(viewModel.get("categoryKey"));
		this.$.category_name.setValue(viewModel.get("categoryName"));
		this.$.category_expanded.setValue(viewModel.get("isExpanded"));
		this.$.category_display.setValue(viewModel.get("isDisplay"));
		this.$.category_display_order.setValue(viewModel.get("displayOrder"));
		this.$.category_description.setEditorContent(viewModel.get("description"));
		// hide this spinner popup.
		Master.view.frame.hideSpinnerPopup(this._uid_category_info);
	},
	/**
	 * For dialog tree node components.
	 */
	showCategoryTreeDialog: function (inSender, inEvent) {
		this.treeDialog = new widgets.dialog.TreeNodeDialog({
			style:"width: 500px; height: 300px;",title:"请选择所属分类",
			childNodeKey:"childs",
			selectedItemKey:"categoryKey",
			selectedItemValue:this.__selectedCategoryKey,
			success: this.bindSafely("treeDialogConfirm"),
			itemConverter: this._treeNodeConverter,
			bubbleTarget: this
		});
		
		this.treeDialog.show();
		// goto fetch availble categories tree.
		var config = {
			viewPage: "category",
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
			categoryKey: item.categoryKey, content: item.categoryName
		};
	},
	treeDialogConfirm: function (inEvent) {
		var selectedNode = inEvent.selectedNode;
		this.$.showCategoryDialogBtn.setContent(selectedNode.get("content"));
		this.__selectedCategoryKey = selectedNode.get("categoryKey");
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