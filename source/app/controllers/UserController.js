enyo.kind({
	name: "Master.controllers.UserController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport",
		"Master.controllers.CategoryTreeSupport"
	],
	published: {
		security:true
	},
	constants: {
		USER_DETAIL: "user.Detail",
	},
	userInfo: function () {
		this.zLog("user info...");
		this.showProfileDockMenus({menuKey: "user-info"});
		this.bindingViewToContent(this.USER_DETAIL, null, null);
	},
	showProfileDockMenus: function (data) {
		//  profile page.
		Master.view.frame.addClass("profile");
		if (!Master.view.frame.hasProfileContentInDock()) {
			this.showProfileMenus(data);
		}
	}
});