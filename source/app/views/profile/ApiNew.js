enyo.kind({
	name: "Master.views.profile.ApiNew",
	kind: "Master.View",
	classes: "api-new",
	events:{
		// get all available categories.
		"onFetchApiAvailableCategories":"",
		// save api information to server.
		"onSaveApiInformation":""
	},
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", onValidationComplete:"formValidationSubmit", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "API KEY"},
					{classes:"form-item", components:[
						{name:"api_key", placeholder:"API KEY", kind:"widgets.forms.InputDecorator", tipMessage:"全局唯一，请一定输入不重复的KEY限英文字母", validation: {required:"必填字段！",hash:""}}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "API名称"},
					{classes:"form-item", components:[
						{name:"api_name", placeholder:"API名称", kind:"widgets.forms.InputDecorator", tipMessage:"API 名称必须填写！", validation: {required:"必填字段！"}}
					]}
				]},
				{kind:"onyx.Groupbox", components: [
					{kind: "onyx.GroupboxHeader", content: "API分类"},
					{classes:"form-item", components:[
						{classes:"title", content:"API分类"},
						{name:"api_categories",key:"categoryId", defaultTitle:"--请选择API分类--", required:true, tipMessage:"必须选择特定的分类", kind:"widgets.forms.DropdownListDecorator"}
					]},
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
	// show app new api ui interface.
	showAddNewApiUI: function (viewModel){
		// show html editors.
		this.showHtmlEditors();
		// show table row datas.
		// loading categories dropdownlist.
		this.fetchAvalilableCategories();
		// 
	},
	fetchAvalilableCategories: function () {
		this.$.api_categories.showSpinner();
		// 
		this.doFetchApiAvailableCategories();
	},
	showAvalilableCategories: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		var records = viewModel.records;
		var _components = [];
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			_components.push({
				content: record.categoryName,
				categoryId: record.categoryId
			});
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
			var  apiDetail = this.readNewApiDetailInformation();
			this.doSaveApiInformation({data: apiDetail});
		}
		// stop  bubble.
		return true;
	},
	//@private for get prepared api detail information.
	readNewApiDetailInformation: function () {
		var _data = {};
		// selecte category
		var selectedCategory = this.$.api_categories.getSelectedItem();
		_data._category = selectedCategory.categoryId; // api  category id.
		_data.key = this.$.api_key.getValue();// api key
		_data.name = this.$.api_name.getValue();// api name.
		_data.description = this.$.api_description.getEditorContent();
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
	},
	/*testButtonTap: function (inSender, inEvent) {
		this.$.requestParams.setRowsDataSource([
			{name:"test name", value:"test value", isRequired:true, description:"test description", more:"<html>00</html>"},
			{name:"test name1", value:"test value1", isRequired:true, description:"test description1", more:"<html>111</html>"}
		]);
		return true;
	},*/
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