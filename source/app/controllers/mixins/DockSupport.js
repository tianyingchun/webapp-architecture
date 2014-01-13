// Note: tahe mixins support has some method will depends on controller.
// so we only can use it in controllers.
enyo.setPath("Master.controllers.DockSupport", {
	name: "Master.controllers.DockSupport",

	// shared view kind name.
	_dockCategoryViewKind: "shared.DockCategories",
	// share view kind name "dock profiles."
	_dockProfileViewKind:  "shared.DockProfiles",
	/**
	 * Get all categories
	 * @param inEvent must contain two parameters @viewAction, @viewkindName.
	 * 
	 */
	getAllCategories: function (extraData) {
		var apiCategories = new Master.models.apipool.Categories();
		// view data.
		var viewData = {
			action: "showUICategories",
			data: extraData || {}
		}
		apiCategories.getApiCategories(enyo.bindSafely(this, "showApiCategories", viewData));
		// binding view to left dock
		this.bindingViewToDock(this._dockCategoryViewKind, null, null);
	},
	// the callback function of getAllCategories().
	showApiCategories: function (viewData, viewModel) {
		this.zLog("response: viewModel: ", viewModel,"viewData:", viewData);
		// check the callback fn
		var extraData = viewData && viewData.data;
		if (extraData.callback) {
			extraData.callback(viewModel);
			delete extraData.callback;
		}
		// show categories view kind.
		var dockViewKind = this._dockCategoryViewKind; //Master.views.shared.DockCategories
		// notify view to update ui interface.
		this.notifyView(dockViewKind, viewModel, viewData);
	},

	// for dock profiles left menu
	showProfileMenus: function (extraData) {
		
		var menuList = new Master.models.menu.MenuList();
		// first binding view to dock.
		this.bindingViewToDock(this._dockProfileViewKind, null,null);
		var viewData = {
			action: "showProfileMenusUI",
			data: extraData || {}
		};
		menuList.getMenus(enyo.bindSafely(this, "showProfileMenusUI", viewData));
	},
	showProfileMenusUI: function (viewData, viewModel) {
		this.notifyView(this._dockProfileViewKind, viewModel, viewData);
	}
});