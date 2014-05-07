enyo.kind({
	name: "Master.models.menu.MenuList",
	kind: "Master.Collection",
	model: "Master.models.menu.MenuItem",
	// get all menus.
	getMenus: function (callback) {
		// for category managerment.
		// var itemModel = new Master.models.menu.MenuItem({
		// 	name:  Master.locale.get("CATEGORY_LIST","menu"),
		// 	key: "category_list", // menu item key.
		// 	customClass: "icon-list-ol",
		// 	hash: "profile/category/list"
		// });
		// this.add(itemModel);

		// // for api managerment
		// var itemModel = new Master.models.menu.MenuItem({
		// 	name:  Master.locale.get("API_LIST","menu"),
		// 	key: "api_list", // menu item key.
		// 	customClass: "icon-list-ul",
		// 	hash: "profile/api/list"
		// });
		// this.add(itemModel);
	
		// for personal center.
		var personalInfo = new Master.models.menu.MenuItem({
			name: Master.locale.get("PERSONAL_INFO","menu"),
			key: "user-info", // menu item key.
			customClass: "icon-user",
			hash: "profile"
		});
		this.add(personalInfo);
		
		if(callback) {
			callback(this);
		}
	}
});