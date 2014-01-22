enyo.kind({
	name: "Master.views.api.Detail",
	kind: "Master.View",
	classes:"api-details",
	components:[
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name: "detailcontainer", showing: false, components: [
			{name: "desc_title", showing: false, content:Master.locale.get("API_DESCRIPTION","title"), classes:"title"},
			{name:"description",showing: false, allowHtml: true, classes:"description"},

			{name: "request_title", showing:false, content:Master.locale.get("API_REQUEST","title"), classes:"title"},
			{name:"request", showing:false, clasess:"request", components: [
				// request body summary method. PUT /BucketName?sign=MBO:aCLCZtoFQg8I
				{content:Master.locale.get("API_REQUEST","title"), classes:"child-title"},
				{name:"request_body", classes:"body", allowHtml: true},
				// request post payload. maybe json string.
				{name:"request_payload_title", showing:false, content:Master.locale.get("API_REQUEST_PAYLOAD","title"), classes:"child-title"},
				{name:"request_payload_body", showing: false, classes:"payload", allowHtml: true},
				// request params comments table.
				{name:"request_params_title",content:Master.locale.get("API_REQUEST_PARAMS","title"), classes:"child-title"},
				{name: "request_params", classes:"parameters"},				
				// request header comments table
				{name:"request_header_title", content:Master.locale.get("API_REQUEST_HEADERS","title"), classes:"child-title"},
				{name:"request_headers",classes:"headers"}
			]},

			{name:"response_title",showing:false, content:Master.locale.get("API_RESPONSE","title"), classes:"title"},
			{name:"response", showing:false, clasess:"response", components: [
				// response result.
				{name:"response_body_title", showing:false, content:Master.locale.get("API_RESPONSE_BODY","title"), classes:"child-title"},
				{name:"response_body", classes:"body", allowHtml: true},
				// reponse result params comments.
				{name:"response_params_title", content:Master.locale.get("API_RESPONSE_PARAMS","title"), classes:"child-title"},
				{name:"response_params", classes:"parameters"},

				{name:"response_header_title", content:Master.locale.get("API_RESPONSE_HEADERS","title"), classes:"child-title"},
				// response headers.
				{name:"response_headers", classes:"headers"}
			]},

			{name:"example_title", showing:false, content:Master.locale.get("API_EXAMPLES","title"), classes:"title"},
			{name:"example", showing:false, clasess:"examples", components: [
				{name:"postcommand", classes:"post-command", allowHtml: true},

				{name:"example_request_title", content:Master.locale.get("API_REQUEST_EXAMPLE","title"), classes:"child-title"},
				{name:"example_request", classes:"example-request", allowHtml: true},

				{name:"example_response_title",content:Master.locale.get("API_RESPONSE_EXAMPLE","title"), classes:"child-title"},
				{name:"example_response", classes:"example-response", allowHtml: true}
			]},		
			{name:"question_title", content:Master.locale.get("API_QUESTIONS","title"), classes:"title qa-title"},
			{name: "questionAnswers", tag:"ul", classes:"question-answers"}
		]}	
	],
	handlers: {
		ontap: "tabCellTap"
	},
	// @protected.
	// language header title display name
	_languageHeaderItemMapping: {
		"cs":"c#"
	},
	// show category detail information.
	showApiDetailUI: function (viewModel, extraData) {
		this.zLog("viewModel: ", viewModel, "extraData: " ,extraData);	
		this.$.message.hide();
		var details = viewModel.get("details") || {};
		// description.
		if (details.description) {
			this.$.description.setContent(details.description || "");
			this.$.desc_title.show();
			this.$.description.show();
		}
		// request block
		if(details.request) {
			this.$.request_title.show();
			this.$.request.show();
			var request = details.request;

			// request body
			this.$.request_body.setContent(request.body);
			
			//request payload.
			if(request.payload) {
				var payloadJson = hljs.highlight("js", request.payload).value;
				this.$.request_payload_body.setContent(payloadJson);
				this.$.request_payload_title.show();
				this.$.request_payload_body.show();
			}

			// request headers.
			var _reqHeaders = request.headers;
			if(_reqHeaders && _reqHeaders.length) {
				// request headers
				this.showApiInterfaceHeaders(this.$.request_headers, _reqHeaders);
			} else {
				this.$.request_header_title.hide();
			}
			// request params.
			var _reqParams = request.params;
			if(_reqParams && _reqParams.length){
				// request parameters.
				this.showApiInterfaceParams(this.$.request_params, _reqParams);
			} else {
				this.$.request_params_title.hide();
			}
		}
		// response block.
		if(details.response) {
			this.$.response_title.show();
			this.$.response.show();
			// response 
			var response = details.response || {};
			if (response.body) {
				var responseJson = hljs.highlight("js", response.body).value;
				// response body.
				this.$.response_body.setContent(responseJson);
				this.$.response_body_title.show();
			}
			// response parameters
			var _resParams = response.params;
			if(_resParams && _resParams.length) {
				this.showApiInterfaceParams(this.$.response_params, _resParams);
			} else {
				this.$.response_params_title.hide();
			}
			var _resHeaders = response.headers;
			if(_resHeaders &&　_resHeaders.length) {
				this.showApiInterfaceHeaders(this.$.response_headers, _resHeaders);
			} else {
				this.$.response_header_title.hide();
			}
		}
		// example block
		var example = details.example;
		if (example) {
			this.$.example_title.show();
			this.$.example.show();
			if (example.postCommand) {
				// example body.
				this.$.postcommand.setContent(example.postCommand);
			} else {
				this.$.postcommand.hide();
			}
			if(example.request) {
				// example request.
				this.$.example_request.setContent(example.request);
			} else {
				this.$.example_request_title.hide();
				this.$.example_request.hide();
			}
			if (example.response) {
				// exmaple response,
				this.$.example_response.setContent(example.response);
			} else {
				this.$.example_response_title.hide();
				this.$.example_response.hide();
			}
		}

		// show questions and answers.
		var questions  = details.questions;
		this.showQuestionAnswers(questions);
		// show detail information.
		this.$.detailcontainer.show();

		//sdk block.
		var sdk = details.sdk;
		if(sdk) {
			this.showSDKPanel(sdk, extraData);
		}
	},
	showSDKPanel: function (sdk, extraData) {
		var tabItems = [];
		for (var item in sdk) {
			var languageName = item.toString();
			var newItem = {
				name: languageName,
				text: this._languageHeaderItemMapping[languageName] || languageName,
				link: this.getSDKLanguageLink(extraData.apiKey, languageName),
				content: sdk[languageName]
			};
			if (extraData.language == languageName) {
				newItem.selected = true;
			}
			tabItems.push(newItem);
		}
		Master.view.frame.setSDKContent(tabItems);
 	},
 	getSDKLanguageLink:function (key, language) {
 		var hash = ["#node",key, language];
 		return hash.join("/");
 	},
	showQuestionAnswers: function (questions) {
		if(questions && questions.length) {
			var components = [];
			for (var i = 0; i < questions.length; i++) {
				var q = questions[i];
				if (q.question && q.answer) { 
					var q_txt = Master.locale.get("TABLE_API_QUESTION","label") + q.question;
					var a_txt = Master.locale.get("TABLE_API_ANSWER","label") + q.answer;
					components.push({
						tag: "li",
						classes:"qa-item",
						components: [
							{tag:"span", allowHtml:true, classes: "question", content: q_txt},
							{tag:"span", allowHtml:true, classes: "answer", content: a_txt}
						]
					});
				}
			};
			var $qa = this.$.questionAnswers;
			$qa.destroyClientControls();
			$qa.createClientComponents(components);
			$qa.render();
		} else {
			this.$.question_title.hide();
		}
	},
	/**
	 * Show api interface headers.
	 * @param  {array} headers the show api interface headers
	 */	
	showApiInterfaceHeaders: function ($header,headers) {
		$header.createComponent({
            kind:'widgets.forms.TableRowItems', 
            keyField:"id",
            itemsSource: headers,
            showCheckbox: false,
            hideFieldItems: ["more","_id"],
            captionText: [
            	Master.locale.get("TABLE_API_PARAMS_NAME", "content"), 
            	Master.locale.get("TABLE_API_PARAMS_VALUE", "content"),
            	Master.locale.get("TABLE_API_PARAMS_REQUIRED", "content"),
            	Master.locale.get("TABLE_API_PARAMS_DESC", "content")
            ],
            actions:[/*'Edit'*/],
            radioModel: true // support only one remove install device.
        });
        $header.render(); 
	},
	// @params {array}
	// show api interface parameters
	showApiInterfaceParams: function ($param, params) { 
		$param.createComponent({
            kind:'widgets.forms.TableRowItems', 
            keyField:"id",
            itemsSource: params,
            showCheckbox: false,
            hideFieldItems: ["more","_id"],
            captionText: [
            	Master.locale.get("TABLE_API_PARAMS_NAME", "content"), 
            	Master.locale.get("TABLE_API_PARAMS_VALUE", "content"),
            	Master.locale.get("TABLE_API_PARAMS_REQUIRED", "content"),
            	Master.locale.get("TABLE_API_PARAMS_DESC", "content")
            ],
            actions:[/*'Edit'*/],
            radioModel: true // support only one remove install device.
        });
        $param.render();
	},
	tabCellTap: function (inSender, inEvent) {
		var originator = inEvent.originator;
		if (originator.kindName == "widgets.forms.TableRowItems") {
			var moreInfo = inEvent.more;
			this.zLog("kindname: ", moreInfo);
			if (moreInfo) {
				Master.view.frame.showNormalDialog("title",moreInfo);
			}	
		}
		return true;
	}
});