enyo.kind({
	name: "Master.views.profile.CategoryEdit",
	kind: "Master.View",
	classes: "category-edit",
	events:{
		"onCommitCategory":""// cutomized event to controller.
	},
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", onValidationComplete:"formValidationSubmit", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "分类KEY"},
					{classes:"form-item", components:[
						{name:"category_key", placeholder:"分类KEY", kind:"widgets.forms.InputDecorator", tipMessage:"全局唯一，请一定输入不重复的KEY限英文字母", validation: {required:"必填字段！",hash:""}}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "分类名称"},
					{classes:"form-item", components:[
						{name:"category_name", placeholder:"分类名称", kind:"widgets.forms.InputDecorator", tipMessage:"分类名称必须填写！", validation: {required:"必填字段！"}}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "默认展开"},
					{classes:"form-item", components:[
						{name:"category_expanded", kind:"onyx.Checkbox"}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "显示顺序"},
					{classes:"form-item", components:[
						{name:"category_display_order", type:"number", kind: "widgets.forms.InputDecorator", tipMessage: "填写分类排序，只能为数字值越大优先级越高", validation: {required:"请输入数字!", number:""}}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "是否显示"},
					{classes:"form-item", components:[
						{name:"category_display", kind:"onyx.Checkbox"}
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
		this.doCommitCategory({data:data, isNew: false});
	},
	// show loading message.
	showLoading:function (message) {
		this._uid_category_info = Master.view.frame.showSpinnerPopup({
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
	}	
});