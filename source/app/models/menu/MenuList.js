enyo.kind({
	name: "Master.models.menu.MenuList",
	kind: "Master.Collection",
	model: "Master.models.menu.MenuItem",
	// get all menus.
	getMenus: function (callback) {
		// for api managerment
		var itemModel = new Master.models.menu.MenuItem({
			name:  Master.locale.get("API_LIST","menu"),
			key: "api_list", // menu item key.
			customClass: "api-list",
			hash: "profile/api/list"
		});
		this.add(itemModel);
		// for category managerment.
		var itemModel = new Master.models.menu.MenuItem({
			name:  Master.locale.get("CATEGORY_LIST","menu"),
			key: "category_list", // menu item key.
			customClass: "api-list",
			hash: "profile/category/list"
		});
		this.add(itemModel);

		var placeHolderMenu = new Master.models.menu.MenuItem({
			name:  "临时占位",
			key: "other", // menu item key.
			customClass: "api-list",
			hash: "profile/api/list"
		});
		this.add(placeHolderMenu);
		if(callback) {
			callback(this);
		}
	}
});