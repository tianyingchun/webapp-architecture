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
					// indicates document if need display
					{classes:"form-item", components:[
						{ classes:"title", content:"是否显示"},
						{name:"api_is_display", kind:"onyx.Checkbox"}
					]},
					// which categorye document belongs to .
					{classes:"form-item", components:[
						{ classes:"title", content:"文档分类"},
						{name:"api_categories",key:"categoryId", defaultTitle:"--请选择API分类--", required:true, tipMessage:"必须选择特定的分类", kind:"widgets.forms.DropdownListDecorator"}
					]}
				]}, 
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "概述"},
					// api descriptons. text editor.
					{name:"api_description", kind: "Master.TextEditor"}		
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "请求"},
					{classes:"form-item", components:[
						{classes:"title", content:"HTTP请求简要信息"},
						{name:"request_body", placeholder:"HTTP请求简要信息", kind:"widgets.forms.TextAreaDecorator", tipMessage:"请填写Http请求的BODY体内容!"}
					]},
					// request params.
					{classes:"form-item", components:[
						{classes:"title", content:"接口参数"},
						{name:"request_params", kind:"widgets.forms.EditableTable",headers:["字段","取值","必填","描述","更多"], cells:[
							{key:"name", controlType:"text"},
							{key:"value", controlType:"text"},
							{key:"isRequired", controlType:"checkbox"},
							{key:"description", controlType:"textarea"},
							{key:"more", controlType:"htmleditor"}
						]}
					]},
					// request headers
					{classes:"form-item", components:[
						{classes:"title", content:"接口Headers"},
						{name:"request_headers", kind:"widgets.forms.EditableTable",headers:["字段","取值","必填","描述","更多"], cells:[
							{key:"name", controlType:"text"},
							{key:"value", controlType:"text"},
							{key:"isRequired", controlType:"checkbox"},
							{key:"description", controlType:"textarea"},
							{key:"more", controlType:"htmleditor"}
						]}
					]}		
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "响应"},
					{classes:"form-item", components:[
						{classes:"title", content:"HTTP响应简要信息"},
						{name:"response_body", placeholder:"HTTP响应简要信息", kind:"widgets.forms.TextAreaDecorator", tipMessage:"请填写Http响应的BODY体内容!"}
					]},
					// response params.
					{classes:"form-item", components:[
						{classes:"title", content:"响应参数简介"},
						{name:"response_params", kind:"widgets.forms.EditableTable",headers:["字段","取值","必填","描述","更多"], cells:[
							{key:"name", controlType:"text"},
							{key:"value", controlType:"text"},
							{key:"isRequired", controlType:"checkbox"},
							{key:"description", controlType:"textarea"},
							{key:"more", controlType:"htmleditor"}
						]}
					]},
					// response headers
					{classes:"form-item", components:[
						{classes:"title", content:"响应Headers简介"},
						{name:"response_headers", kind:"widgets.forms.EditableTable",headers:["字段","取值","必填","描述","更多"], cells:[
							{key:"name", controlType:"text"},
							{key:"value", controlType:"text"},
							{key:"isRequired", controlType:"checkbox"},
							{key:"description", controlType:"textarea"},
							{key:"more", controlType:"htmleditor"}
						]}
					]}		
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "测试示例"},
					// post command
					{classes:"form-item", components:[
						{classes:"title", content:"POST 命令"},
						{name:"example_post_body", placeholder:"输入POST 测试的命令代码", kind:"widgets.forms.InputDecorator", tipMessage:"输入POST 测试的命令代码"}
					]},
					// exmaple post request string
					{classes:"form-item", components:[
						{classes:"title", content:"POST 请求串"},
						{name:"example_request", placeholder:"输入POST 测试请求串", kind:"widgets.forms.InputDecorator", tipMessage:"输入POST 测试请求串"}
					]},
					// exmaple post response string
					{classes:"form-item", components:[
						{classes:"title", content:"POST 响应串"},
						{name:"example_response", placeholder:"输入POST 测试响应串", kind:"widgets.forms.InputDecorator", tipMessage:"输入POST 测试响应串"}
					]}				
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "问答"},
					{classes:"form-item question-answers", components:[
						{name:"question_answers", kind:"widgets.forms.EditableTable",headers:["问题","答案"], cells:[
							{key:"question", controlType:"textarea"},
							{key:"answer", controlType:"textarea"}
						]}
					]}		
				]}
			]},
			// {name:"testButton", kind:"onyx.Button",content:"TestButton", ontap: "testButtonTap"},
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
		// loading categories dropdownlist.
		this.fetchAvalilableCategories();
	},
	fetchAvalilableCategories: function () {
		this.$.api_categories.showSpinner();
		this.doFetchApiAvailableCategories({editModel:true});
	},
	showAvalilableCategories: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		var records = viewModel.records;
		var _components = [];
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			var _item = {
				content: record.categoryName,
				categoryId: record.categoryId
			};
			if(this._categoryId == record.categoryId) {
				_item.selected = true;
			}
			_components.push(_item);
		};
		this.$.api_categories.set("menuItemComponents", _components);
	},
	showHtmlEditors: function () {
		this.$.api_description.markItUp();
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
		this._categoryId = viewModel.get("categoryId");
		this._apiId = viewModel.get("apiId");
		this.$.api_key.setValue(viewModel.get("apiKey"));
		this.$.api_name.setValue(viewModel.get('apiName'));
		this.$.api_display_order.setValue(viewModel.get("displayOrder")||0);
		this.$.api_is_display.setValue(viewModel.get("isDisplay") || 0);
		
		var detail = viewModel.get("details");
		this.$.api_description.setEditorContent(detail.description);
		// request.
		var request  = detail.request;
		this.$.request_body.setValue(request.body);
		this.$.request_params.set("rowsDataSource", request.params);
		this.$.request_headers.set("rowsDataSource", request.headers);
		// response
		var response = detail.response;
		this.$.response_body.setValue(response.body);
		this.$.response_params.set("rowsDataSource", response.params);
		this.$.response_headers.set("rowsDataSource", response.headers);

		//example
		var example = detail.example;
		this.$.example_post_body.setValue(example.postCommand||"");
		this.$.example_request.setValue(example.request||"");
		this.$.example_response.setValue(example.response||"");

		var questions = detail.questions;
		this.$.question_answers.set("rowsDataSource", questions);
		// hide loading spinner.
		Master.view.frame.hideSpinnerPopup(spinner_uid);
	},
	//@private for get prepared api detail information.
	readApiDetailInformation: function () {
		var _data = {};
		// selecte category
		var selectedCategory = this.$.api_categories.getSelectedItem();
		_data._category = selectedCategory.categoryId; // api  category id.
		_data.apiId = this._apiId;
		_data.apiKey = this.$.api_key.getValue();// api key
		_data.apiName = this.$.api_name.getValue();// api name.
		// displayOrder.
		_data.displayOrder = this.$.api_display_order.getValue();
		_data.description = this.$.api_description.getEditorContent();
		_data.isDisplay = this.$.api_is_display.getValue();
		_data.request = {
			body: this.$.request_body.getValue(),
			params: this.$.request_params.getTableJSONResult(),
			headers: this.$.request_headers.getTableJSONResult()
		};
		_data.response = {
			body: this.$.response_body.getValue(),
			params: this.$.response_params.getTableJSONResult(),
			headers: this.$.response_headers.getTableJSONResult()
		};
		_data.example = {
			postCommand: this.$.example_post_body.getValue(),
			request: this.$.example_request.getValue(),
			response: this.$.example_response.getValue()
		};
		_data.questions = this.$.question_answers.getTableJSONResult()
		return _data;
	}
});