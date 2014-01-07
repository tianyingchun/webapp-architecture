/**
 * controllers namespace start Master.controllers.ApiController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.ApiController",
	kind: "Master.Controller",
	// set up default language for current api document.
	defaultLanguage: Master.config.defaultAPILanguage,

	mixins:[
		//Note we have bindinged view and controller mapping for leftdock view. so 
		//if we need to render main content we need use event bubble to update.
		"Master.controllers.DockSupport"
	],
	// default action :/node/api
	index: function (apiKey){
		this.zLog("apiKey: ", apiKey);
		// show left dock categories.
		this.node(apiKey, null);
	},
	/**
	 * Action: node,
	 * mapping: { path: "node/:api/:language", controller: "ApiController", action: "node"}
	 */
	node: function (apiKey, language) {
		this.zLog("apiKey: ", apiKey, " ,language:", language);
		language = language || this.defaultLanguage;

		// SHOW left dock categories if not.
		this.showDockCategories("api.Node", {apiKey: apiKey});
	},
	//@* public show categories on left dock
	showDockCategories: function (viewKindName, extraData) {
		if (!Master.view.frame.hasContentsIndock()) {
			// maybe async fetch data here.
			this.getAllCategories(null, {viewAction: "showUICategories",viewKindName: viewKindName}, extraData);
		}
	}
});