enyo.kind({
	name: "Master.controllers.ProfileController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport"
	],
	apiList: function () {
		this.zLog("list");
		this.showProfileMenus({menuKey: "list"});
	},
	/**
	 * Action methods add new api information
	 */
	addNewApi: function () {
		this.zLog("add new");
		// show profile.
		this.showProfileMenus({menuKey: "list"});
	},
	editApi:function(apiId) {
		this.zLog("apiId: ", apiId);
		this.showProfileMenus({menuKey: "list"});
	},
	removeApi: function (apiId) {
		this.zLog("apiId:", apiId);
		this.showProfileMenus({menuKey: "list"});
	}
});