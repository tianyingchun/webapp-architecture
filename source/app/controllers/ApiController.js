/**
 * controllers namespace start Master.controllers.ApiController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.ApiController",
	kind: "Master.Controller",
	// set up default language for current api document.
	defaultLanguage: "java",
	
	handlers: {
		
	},
	// default action :/node/api
	index: function (apiName){
		this.zLog("apiname: ", apiName);
		var viewName = "api.Index";
		var viewKindConfig = this.bindingView(viewName, null, null);
		Master.view.frame.setMainContent(viewKindConfig);
	},
	/**
	 * Action: node,
	 * mapping: { path: "node/:api/:language", controller: "ApiController", action: "node"}
	 */
	node: function (apiName, language) {
		this.zLog("apiname: ", apiName, " ,language:", language);
		language = language || this.defaultLanguage;

		var viewName = "api.Node";
		var viewKindConfig = this.bindingView(viewName, null, null );
		Master.view.frame.setMainContent(viewKindConfig);
	}
});