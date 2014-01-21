enyo.kind({
	name: "Master.views.profile.CategoryNew",
	kind: "Master.View",
	classes: "category-new",
	events:{
		"onCommitCategory":""// cutomized event to controller.
	},
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", onValidationComplete:"formValidationSubmit", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "分类KEY"},
					{classes:"form-item", components:[
						{name:"category_key", allowEmpty:false, placeholder:"分类KEY", kind:"widgets.forms.InputDecorator", tipMessage:"全局唯一，请一定输入不重复的KEY限英文字母", validation: {required:"必填字段！",hash:""}}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "分类名称"},
					{classes:"form-item", components:[
						{name:"category_name", allowEmpty:false, placeholder:"分类名称", kind:"widgets.forms.InputDecorator", tipMessage:"分类名称必须填写！", validation: {required:"必填字段！"}}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "默认展开"},
					{classes:"form-item", components:[
						{name:"category_expanded", kind:"onyx.Checkbox"}
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
				this.zWarn("viewActionFn don't exist!:", viewAction);
			}
		}
	}),
	// show app new api ui interface.
	showAddNewCategoryUI: function (viewModel){
		// show html editors.
		this.showHtmlEditors();
		// show table row datas.
		// 
		// 
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
			description: this.$.category_description.getEditorContent()
		};
		this.doCommitCategory({data:data});
	}
});