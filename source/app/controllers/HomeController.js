/**
 * controllers namespace start Master.controllers.xxxController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.HomeController",
	kind: "Master.Controller",
	handlers: {
		onTapTest: "tapTest"
	},
	/**
	 * Action method
	 * @method 
	 */
	index: function () {
		var viewData = null;
		this.zLog("action data: ", viewData);
		var viewKindName = "home.Index";
		// maybe async fetch data here.
		this.getHomeData();

		this.bindingView(viewKindName, null, viewData);
	},
	/**
	 * Ajax request data from server.
	 */
	getHomeData: function (inArgs) {
		// do some thing..
		var viewModel = {test: "viewModel"};
		this.notifyView(viewModel);
	},
	tapTest: function (inSender, inEvent) {
		this.zLog("inSender: ", inSender, "inEvent: ",inEvent);
		return true;
	}
});