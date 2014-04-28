enyo.kind({
	name: "Master.views.shared.DockProfiles",
	kind: "Master.View",
	classes: "dock-profile-meus",
	components:[
		{name:"message",kind:"widgets.base.Spinner",size:25, message: Master.locale.get("LOAD_PORFILE_MENUS", "message")},
		// {classes: "dock-title", content:Master.locale.get("API_CATALOG","title")},
		{name: "list", kind:"List", multiSelect: false, ontap:"menuItemTap", onSetupItem:"menuSetUpItem", showing: false, components: [
			{ name:"listitem", classes: "list-item", components: [
				{ name:"menuItemIcon", tag:"i"},
				{ name:"menuItem", tag:"span", content:""}
			]}
		]},
		{kind:"widgets.menus.TreeMenu", onItemClick:"treeNodeClick", onItemExpandChanged:"treeNodeExpandChanged"}
	],
	showProfileMenusUI: function (viewModel, data) {
		this.zLog("viewModel", viewModel, "data: ", data);
		// save current menu  items.
		this.menuItems = viewModel.records;	
		this.selectedKey = data.menuKey;
		this.$.list.setCount(this.menuItems.length);
		this.$.list.reset();
		this.$.message.hide();
		this.$.list.show();
	},
	menuSetUpItem: function (inSender, inEvent) {
		var index = inEvent.index;
		var currItem = this.menuItems[index];
		this.$.menuItem.setContent(currItem.get("name"));
		var isSelected = this.selectedKey == currItem.get("key");
		this.$.menuItemIcon.setAttribute("class", currItem.get("customClass"));
		this.$.listitem.addRemoveClass("selected", isSelected);
	},
	/**
	 * Highlight profil menu item.
	 * @param  {object} viewModel null
	 * @param  {object} data, the menu item data
	 */
	highlightProfileMenuItem: function (viewModel, data) {
		this.zLog("data:", data);
		this.selectedKey = data.menuKey;
		this.$.list.reset();
	},
	menuItemTap: function (inSender, inEvent) {
		var index = inEvent.index;
		var currItem = this.menuItems[index];
		if (currItem) {
			var hash = currItem.get("hash");
			this.location(hash);
		} else {
			this.zError("dock menu item tap: item data don't exit!");
		}
		return true;
	},

	// for tree node 
	// 
	treeNodeClick: function (inSender, inEvent) {
		this.zLog(inEvent);
		return true;
	},
	treeNodeExpandChanged: function (inSender, inEvent) {
		this.zLog(inEvent);
		return true;
	}
});