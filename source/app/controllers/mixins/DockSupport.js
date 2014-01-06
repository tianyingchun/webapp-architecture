// Note: tahe mixins support has some method will depends on controller.
// so we only can use it in controllers.
enyo.setPath("Master.DockSupport", {
	name: "Master.DockSupport",
	/**
	 * Get all categories
	 * @param inEvent must contain two parameters @viewAction, @viewkindName.
	 * 
	 */
	getAllCategories: function (inSender, inEvent) {
		// pass viewAction from specifc controller.
		var viewAction = inEvent && inEvent.viewAction || "showUICategories";
		var viewKindName  = inEvent && inEvent.viewKindName || "home.Index";
		var apiCategories = new Master.models.apipool.Categories();
		apiCategories.getApiCategories(enyo.bindSafely(this, "showApiCategories", viewAction));

		var viewKindConfig = this.bindingView(viewKindName, null, null);
 		// show in dock.
 		Master.view.frame.setDockContent(viewKindConfig);

		return true;
	},
	// the callback function of getAllCategories().
	showApiCategories: function (viewAction, viewModel) {
		this.zLog("response: ", viewModel, viewAction);
		// save current request view model action. we should put viewAction invoke before viewModel property changed.
		this.set("viewAction", viewAction);
		// update current viewModel for current controller.
		this.set("viewModel",viewModel);
	}
});