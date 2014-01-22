enyo.kind({
	name: "Master.views.api.Detail",
	kind: "Master.View",
	classes:"api-details",
	components:[
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name: "detailcontainer", showing: false, components: [
			{name: "descTitle", showing: false, content:Master.locale.get("API_DESCRIPTION","title"), classes:"title"},
			{name:"description",showing: false, allowHtml: true, classes:"description"},

			{name: "requestTitle", showing:false, content:Master.locale.get("API_REQUEST","title"), classes:"title"},
			{name:"request", showing:false, clasess:"request", components: [
				// request body summary method. PUT /BucketName?sign=MBO:aCLCZtoFQg8I
				{content:Master.locale.get("API_REQUEST","title"), classes:"child-title"},
				{name:"reqbody", classes:"body", allowHtml: true},
				// request post payload. maybe json string.
				{name:"payloadtitle", showing:false, content:Master.locale.get("API_REQUEST_PAYLOAD","title"), classes:"child-title"},
				{name:"reqpayload", showing: false, classes:"payload", allowHtml: true},
				// request params comments table.
				{name:"paramstitle",content:Master.locale.get("API_REQUEST_PARAMS","title"), classes:"child-title"},
				{name: "params", classes:"parameters"},				
				// request header comments table
				{name:"reqHeaderTitle", content:Master.locale.get("API_REQUEST_HEADERS","title"), classes:"child-title"},
				{name:"reqheader",classes:"headers"}
			]},

			{name:"responseTitle",showing:false, content:Master.locale.get("API_RESPONSE","title"), classes:"title"},
			{name:"response", showing:false, clasess:"response", components: [
				// response result.
				{name:"resbodytitle", showing:false, content:Master.locale.get("API_RESPONSE_BODY","title"), classes:"child-title"},
				{name:"resbody", classes:"body", allowHtml: true},
				// reponse result params comments.
				{name:"resParamsTitle", content:Master.locale.get("API_RESPONSE_PARAMS","title"), classes:"child-title"},
				{name:"resParams", classes:"parameters"},

				// response headers.
				{name:"resheader",allowHtml: true,  classes:"headers"}
			]},

			{name:"exampleTitle", showing:false, content:Master.locale.get("API_EXAMPLES","title"), classes:"title"},
			{name:"example", showing:false, clasess:"examples", components: [
				{name:"postcommand", classes:"post-command", allowHtml: true},

				{content:Master.locale.get("API_REQUEST_EXAMPLE","title"), classes:"child-title"},
				{name:"examplereq", classes:"example-request", allowHtml: true},

				{content:Master.locale.get("API_RESPONSE_EXAMPLE","title"), classes:"child-title"},
				{name:"exampleres", classes:"example-response", allowHtml: true}
			]},		
			{name:"qaTitle", content:Master.locale.get("API_QUESTIONS","title"), classes:"title qa-title"},
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
			this.$.descTitle.show();
			this.$.description.show();
		}
		// request block
		if(details.request) {
			this.$.requestTitle.show();
			this.$.request.show();
			var request = details.request;
			// request headers
			this.showApiInterfaceHeaders(request.headers);
			// request parameters.
			this.showApiInterfaceParams(request.params);

			// request body
			this.$.reqbody.setContent(request.body);
			
			//request payload.
			if(request.payload) {
				var payloadJson = hljs.highlight("js", request.payload).value;
				this.$.reqpayload.setContent(payloadJson);
				this.$.payloadtitle.show();
				this.$.reqpayload.show();
			}
		}
		if(details.response) {
			this.$.responseTitle.show();
			this.$.response.show();
			// response 
			var response = details.response || {};
			if (response.body) {
				var responseJson = hljs.highlight("js", response.body).value;
				// response body.
				this.$.resbody.setContent(responseJson);
				this.$.resbodytitle.show();
			}
			// response parameters comments.
			this.showResponseParameters(response.params);
			//response headers.
			this.$.resheader.setContent(response.headers);
		}
		if (details.examples) {
			this.$.exampleTitle.show();
			this.$.example.show();

			// examples
			var example = details.examples || {};
			// example body.
			this.$.postcommand.setContent(example.postCommand);
			// example request.
			this.$.examplereq.setContent(example.request);
			// exmaple response,
			this.$.exampleres.setContent(example.response);
		}

		// show questions and answers.
		var questions  = details.questions;
		this.showQuestionAnswers(questions);
		// show detail information.
		this.$.detailcontainer.show();

		//sdk
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
			this.$.qaTitle.hide();
		}
	},
	/**
	 * Show api interface headers.
	 * @param  {array} headers the show api interface headers
	 */	
	showApiInterfaceHeaders: function (headers) {
		if(headers && headers.length) {
			this.$.reqheader.createComponent({
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
	        this.$.reqheader.render();
		} else {
			this.$.reqHeaderTitle.hide();
		}
	},
	// @params {array}
	// show api interface parameters
	showApiInterfaceParams: function (params) {
		if(params && params.length) {
			this.$.params.createComponent({
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
	        this.$.params.render();
		} else {
			this.$.paramstitle.hide();
		}
	},
	// help method for response parameters comments table.
	showResponseParameters: function (params) {
		if(params && params.length) {
			this.$.resParams.createComponent({
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
	        this.$.resParams.render();
		} else {
			this.$.resParamsTitle.hide();
		}
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