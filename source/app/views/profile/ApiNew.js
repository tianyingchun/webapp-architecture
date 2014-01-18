enyo.kind({
	name: "Master.views.profile.ApiNew",
	kind: "Master.View",
	classes: "api-new",
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", onValidationComplete:"formValidationSubmit", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "概述"},
					// api descriptons. text editor.
					{name:"apiDescription", kind: "Master.TextEditor"}		
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "请求"},
					{classes:"form-item", components:[
						{classes:"title", content:"HTTP请求简要信息"},
						{name:"requestBody", allowEmpty:false, placeholder:"input something", kind:"widgets.forms.TextAreaDecorator", tipMessage:"请填写Http请求的BODY体内容!"}
					]},
					{classes:"form-item", components:[
						{classes:"title", content:"接口参数"},
						{name:"requestParams", kind:"widgets.forms.EditableTable",fields:[
							{key:"name", controlType:"text"},
							{key:"value", controlType:"text"},
							{key:"isRequired", controlType:"checkbox"},
							{key:"description", controlType:"textarea"},
							{key:"more", controlType:"htmleditor"}
						],headers:["字段","取值","必填","描述","更多"]}
					]}			
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "响应"},
					{classes:"form-item", components:[
						{classes:"title", content:"API 描述"},
						{allowEmpty:true, placeholder:"input something", kind:"widgets.forms.InputDecorator", tipMessage:"tipMessage", validation: {required:"", email:"邮件格式不正确！"}}
					]},
					{classes:"form-item", components:[
						{classes:"title", content:"API 描述"},
						{allowEmpty:true, placeholder:"input something", kind:"widgets.forms.InputDecorator", tipMessage:"tipMessage", validation: {required:"", email:"邮件格式不正确！"}}
					]}				
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "示例"},
					{classes:"form-item", components:[
						{classes:"title", content:"API 描述"},
						{allowEmpty:true, placeholder:"input something", kind:"widgets.forms.InputDecorator", tipMessage:"tipMessage", validation: {required:"", email:"邮件格式不正确！"}}
					]},
					{classes:"form-item", components:[
						{classes:"title", content:"API 描述"},
						{allowEmpty:true, placeholder:"input something", kind:"widgets.forms.InputDecorator", tipMessage:"tipMessage", validation: {required:"", email:"邮件格式不正确！"}}
					]}				
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "问答"},
					{classes:"form-item", components:[
						{classes:"title", content:"API 描述"},
						{allowEmpty:true, placeholder:"input something", kind:"widgets.forms.InputDecorator", tipMessage:"tipMessage", validation: {required:"", email:"邮件格式不正确！"}}
					]},
					{classes:"form-item", components:[
						{classes:"title", content:"API 描述"},
						{allowEmpty:true, placeholder:"input something", kind:"widgets.forms.InputDecorator", tipMessage:"tipMessage", validation: {required:"", email:"邮件格式不正确！"}}
					]}				
				]}
			]},
			{name:"textEditor", kind: "Master.TextEditor"},
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
	showAddNewApiUI: function (viewModel){
		// show html editors.
		this.showHtmlEditors();
		// show table row datas.
		// 
		// 
	},
	showHtmlEditors: function () {
		this.$.apiDescription.markItUp();
		this.$.textEditor.markItUp();
	},
	formValidationSubmit: function (inSender, inEvent) {
		var validationResult = inEvent;
		this.zLog("form validation result", validationResult);
		// success/failed.
		if (validationResult.status =="success") {
			// do bisiness logics.
			this.$.requestParams.getTableJSONResult();
		}
		// stop  bubble.
		return true;
	},
	// button handler for creating new api
	addNewApi: function (inSender, inEvent) {
		var editorText = this.$.textEditor.getEditorContent();
		this.zLog("add new text:", editorText);
		this.$.form.submit();
		return true;
	},
	resetNewApi: function (inSender, inEvent) {
		this.zLog("reset text:", inEvent);
		return true;
	}
});