/**
 * controllers namespace start Master.controllers.xxxController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.HomeController",
	kind: "Master.Controller",
	handlers: {
		onGetAllCategories: "getAllCategories"
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
		this.getAllCategories(null, {viewAction: "showCategories"});

		var viewKindConfig = this.bindingView(viewKindName, null, viewData);
 		// show in dock.
 		Master.view.frame.setDockContent(viewKindConfig);
	},
	showApiCategories: function (viewAction, viewModel) {
		this.zLog("response: ", viewModel, viewAction);
		// save current request view model action. we should put viewAction invoke before viewModel property changed.
		this.set("viewAction", viewAction);
		// update current viewModel for current controller.
		this.set("viewModel",viewModel);
	},
	// do server request.
	getAllCategories: function (inSender, inEvent) {
		var viewAction = inEvent && inEvent.viewAction;
		var apiCategories = new Master.models.apipool.Categories();
		apiCategories.getApiCategories(enyo.bindSafely(this, "showApiCategories", viewAction));
		return true;
	}
});