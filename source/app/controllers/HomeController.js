/**
 * controllers namespace start Master.controllers.xxxController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.HomeController",
	kind: "Master.Controller",
	mixins:[
		"Master.DockSupport"
	],
	handlers: {
		onGetAllCategories: "getAllCategories"
	},
	/**
	 * Action method
	 * @method 
	 */
	index: function () {
		if (!Master.view.frame.hasContentsIndock()) {
			// fetch all categories from server and show it on the left dock.
			this.getAllCategories(null, {viewAction: "showUICategories", viewKindName: "home.Index"});
		}
		// show default category detail information in main content.
		// DOTO...
	}
});