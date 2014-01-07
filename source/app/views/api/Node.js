enyo.kind({
	name: "Master.views.api.Node",
	kind: "Master.View",
	classes:"api-details",
	components:[
		{name:"message", content: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{content:Master.locale.get("API_DESCRIPTION","title"), classes:"title"},
		{name:"description", allowHtml: true, classes:"description"},

		{content:Master.locale.get("API_REQUEST","title"), classes:"title"},
		{name:"request", clasess:"request", components: [
			{content:Master.locale.get("API_REQUEST_PARAMS","title"), classes:"child-title"},
			{name: "params", classes:"parameters"},
			{content:Master.locale.get("API_REQUEST","title"), classes:"child-title"},
			{name:"reqbody", classes:"body", allowHtml: true},
			{content:Master.locale.get("API_REQUEST_HEADERS","title"), classes:"child-title"},
			{name:"reqheader", allowHtml: true, classes:"headers"}
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
	showCategoryDetailPage: function (viewModel, viewData) {
		this.zLog("viewModel", viewModel);	
		this.$.message.hide();
		var details = viewModel.get("details") || {};
		// description.
		this.$.description.setContent(details.description || "");
		var request = details.request || {};
		// request body
		this.$.reqbody.setContent(request.body);
		// request headers
		this.$.reqheader.setContent(request.headers);
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
	}	
});