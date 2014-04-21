enyo.kind({
	name: "Master.views.profile.CategoryNew",
	kind: "Master.View",
	classes: "category-new",
	events:{
		"onCommitCategory":""// cutomized event to controller.
	},
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", onValidationComplete:"formValidationSubmit",submitButtonStyles:"btn btn-primary",submitButtonText:"确认添加", kind:"widgets.forms.FormDecorator", components: [
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
						{name:"category_display_order", value:0, type:"number", kind: "widgets.forms.InputDecorator", tipMessage: "填写分类排序，只能为数字值越大优先级越高", validation: {required:"请输入数字!", number:""}}
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
			Master.view.frame.setDockContentTitle("添加分类信息");
		};
	}),
	// show app new api ui interface.
	showAddNewCategoryUI: function (viewModel){
		// show html editors.
		this.showHtmlEditors();
	},
	showHtmlEditors: function () {
		this.$.category_description.markItUp();
	},
	formValidationSubmit: function (inSender, inEvent) {
		var validationResult = inEvent;
		this.zLog("form validation result", validationResult);
		// success/failed.
		if (validationResult.status =="success") {
			// do bisiness logics.
			this.commitCategorydata();
		}
		// stop  bubble.
		return true;
	},
	// @private commit category data.
	commitCategorydata: function (){
		var data = {
			categoryKey: this.$.category_key.getValue(),
			categoryName: this.$.category_name.getValue(),
			isExpanded: this.$.category_expanded.getValue(),
			isDisplay: this.$.category_display.getValue(),
			displayOrder: this.$.category_display_order.getValue(),
			description: this.$.category_description.getEditorContent()
		};
		this.doCommitCategory({data:data, isEditModel:false});
	}
});