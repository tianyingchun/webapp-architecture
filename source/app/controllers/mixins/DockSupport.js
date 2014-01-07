// Note: tahe mixins support has some method will depends on controller.
// so we only can use it in controllers.
enyo.setPath("Master.controllers.DockSupport", {
	name: "Master.controllers.DockSupport",
	/**
	 * Get all categories
	 * @param inEvent must contain two parameters @viewAction, @viewkindName.
	 * 
	 */
	getAllCategories: function (inSender, inEvent, extraData) {
		// pass viewAction from specifc controller.
		var viewAction = inEvent && inEvent.viewAction || "showUICategories";
		var viewKindName  = inEvent && inEvent.viewKindName || "home.Index";
		var apiCategories = new Master.models.apipool.Categories();
		// view data.
		var viewData = {
			action: viewAction,
			data: extraData
		}
		apiCategories.getApiCategories(enyo.bindSafely(this, "showApiCategories", viewData));

		var viewKindConfig = this.bindingView(viewKindName, null, null);
 		// show in dock.
 		Master.view.frame.setDockContent(viewKindConfig);

		return true;
	},
	// the callback function of getAllCategories().
	showApiCategories: function (viewData, viewModel) {
		this.zLog("response: viewModel: ", viewModel,"viewData:", viewData);
		// save current request view model action. we should put viewAction invoke before viewModel property changed.
		this.set("viewData", viewData);
		// update current viewModel for current controller.
		this.set("viewModel",viewModel);
	}
});