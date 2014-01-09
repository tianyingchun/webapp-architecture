enyo.kind({
	name: "Master.views.api.Node",
	kind: "Master.View",
	classes:"api-details",
	components:[
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name: "detailcontainer", showing: false, components: [
			{content:Master.locale.get("API_DESCRIPTION","title"), classes:"title"},
			{name:"description", allowHtml: true, classes:"description"},

			{content:Master.locale.get("API_REQUEST","title"), classes:"title"},
			{name:"request", clasess:"request", components: [
				{name:"paramstitle",content:Master.locale.get("API_REQUEST_PARAMS","title"), classes:"child-title"},
				{name: "params", classes:"parameters"},

				{content:Master.locale.get("API_REQUEST","title"), classes:"child-title"},
				{name:"reqbody", classes:"body", allowHtml: true},

				{name:"reqHeaderTitle", content:Master.locale.get("API_REQUEST_HEADERS","title"), classes:"child-title"},
				{name:"reqheader",classes:"headers"}
			]},

			{content:Master.locale.get("API_RESPONSE","title"), classes:"title"},
			{name:"response", clasess:"response", components: [
				{name:"resbody", classes:"body", allowHtml: true},
				{name:"resheader",allowHtml: true,  classes:"headers"}
			]},

			{content:Master.locale.get("API_EXAMPLES","title"), classes:"title"},
			{name:"examples", clasess:"examples", components: [
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
				this.zWarn("viewActionFn don't exist!");
			}
		}
	}),
	// show category detail information.
	showCategoryDetailPage: function (viewModel, extraData) {
		this.zLog("viewModel: ", viewModel, "extraData: " ,extraData);	
		this.$.message.hide();
		var details = viewModel.get("details") || {};
		// description.
		this.$.description.setContent(details.description || "");
		var request = details.request || {};

		// request headers
		this.showApiInterfaceHeaders(request.headers);
		// request parameters.
		this.showApiInterfaceParams(request.params);

		// request body
		this.$.reqbody.setContent(request.body);
		
		// response 
		var response = details.response || {};
		// response body.
		this.$.resbody.setContent(response.body);
		//response headers.
		this.$.resheader.setContent(response.headers);

		// examples
		var example = details.examples || {};
		// example body.
		this.$.postcommand.setContent(example.postCommand);
		// example request.
		this.$.examplereq.setContent(example.request);
		// exmaple response,
		this.$.exampleres.setContent(example.response);

		// show questions and answers.
		var questions  = details.questions;
		this.showQuestionAnswers(questions);
		// show detail information.
		this.$.detailcontainer.show();

		//sdk
		var sdk = details.sdk || {};
		this.showSDKPanel(sdk, extraData);
	},
	showSDKPanel: function (sdk, extraData) {
		var tabItems = [];
		for (var item in sdk) {
			var languageName = item.toString();
			var newItem = {
				name: languageName,
				text: languageName,
				link: this.getSDKLanguageLink(languageName),
				content: sdk[languageName]
			};
			if (extraData.language == languageName) {
				newItem.selected = true;
			}
			tabItems.push(newItem);
		}
		Master.view.frame.setSDKContent(tabItems);
 	},
 	getSDKLanguageLink:function (language) {
 		var path = location.hash;
 		var regex = /node\/([a-zA-Z0-9-]*)\/([a-zA-Z([a-zA-Z0-9-]*)/;
 		var matches = regex.exec(path);
 		matches = matches.slice(1);
 		// delete language.
 		matches.pop();
 		matches.push(language || Master.config.defaultAPILanguage);
 		matches.unshift("node");
 		return "#" + matches.join("/");
 	},
	showQuestionAnswers: function (questions) {
		if(questions.length) {
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
		if(headers.length) {
			this.$.reqheader.createComponent({
	            kind:'widgets.forms.TableRowItems', 
	            keyField:"id",
	            itemsSource: headers,
	            showCheckbox: false,
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
		if(params.length) {
			this.$.params.createComponent({
	            kind:'widgets.forms.TableRowItems', 
	            keyField:"id",
	            itemsSource: params,
	            showCheckbox: false,
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
	}	
});