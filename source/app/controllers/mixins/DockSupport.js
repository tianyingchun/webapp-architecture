// Note: tahe mixins support has some method will depends on controller.
// so we only can use it in controllers.
enyo.setPath("Master.controllers.DockSupport", {
	name: "Master.controllers.DockSupport",
	// Note. mixin properties/methods only as fields be mixin in host instance
	// we don't have ablity defined "constants" like controllers.
	// shared view kind name.
	DOCK_CATEGORY_KIND: "shared.DockCategories",
	// share view kind name "dock profiles."
	DOCK_PROFILE_KIND:  "shared.DockProfiles",
	/**
	 * Get all categories
	 * @param inEvent must contain two parameters @viewAction, @viewkindName.
	 * 
	 */
	getAllCategories: function (extraData) {
		// the collection model won't be cached in __global__ enyo.store.records object
		// so we don't need to cache this model in current controller.
		var apiCategories = this.getCollectionInstance("Master.models.apipool.Categories");
		// view data.
		var viewData = {
			action: "showUICategories",
			data: extraData || {}
		}
		apiCategories.getApiCategories(this.bind("showApiCategories", viewData));
		// binding view to left dock
		this.bindingViewToDock(this.DOCK_CATEGORY_KIND, null, null);
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
		var dockViewKind = this.DOCK_CATEGORY_KIND; //Master.views.shared.DockCategories
		// notify view to update ui interface.
		this.notifyView(dockViewKind, viewModel, viewData);
	},

	// for dock profiles left menu
	showProfileMenus: function (extraData) {
		
		var menuList = this.getCollectionInstance("Master.models.menu.MenuList");
		// first binding view to dock.
		this.bindingViewToDock(this.DOCK_PROFILE_KIND, null,null);
		var viewData = {
			action: "showProfileMenusUI",
			data: extraData || {}
		};
		menuList.getMenus(this.bind("showProfileMenusUI", viewData));
	},
	showProfileMenusUI: function (viewData, viewModel) {
		this.notifyView(this.DOCK_PROFILE_KIND, viewModel, viewData);
	},
	/**
	 * Hightight profile menu item,
	 * @param  {object} data the key data for highlight item.
	 */
	highlightProfileMenuItem: function (data) {
		if (Master.view.frame.hasProfileContentInDock()) {
			var viewData = {
				action: "highlightProfileMenuItem",
				data: data || {}
			};
			this.notifyView(this.DOCK_PROFILE_KIND, {}, viewData);
		}
	}
});