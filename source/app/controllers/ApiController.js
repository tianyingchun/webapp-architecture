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
		"Master.DockSupport"
	],
	// default action :/node/api
	index: function (apiName){
		this.zLog("apiname: ", apiName);
		// show left dock categories.
		this.showDockCategories("api.Index");
	},
	/**
	 * Action: node,
	 * mapping: { path: "node/:api/:language", controller: "ApiController", action: "node"}
	 */
	node: function (apiName, language) {
		this.zLog("apiname: ", apiName, " ,language:", language);
		language = language || this.defaultLanguage;

		// SHOW left dock categories if not.
		this.showDockCategories("api.Node");
	},
	//@* public show categories on left dock
	showDockCategories: function (viewKindName) {
		if (!Master.view.frame.hasContentsIndock()) {
			// maybe async fetch data here.
			this.getAllCategories(null, {viewAction: "showUICategories",viewKindName: viewKindName});
		}
	}
});