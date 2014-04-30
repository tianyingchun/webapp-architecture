enyo.kind({
	name: "Master.views.shared.DockProfiles",
	kind: "Master.View",
	classes: "dock-profile-meus",
	components:[
		{name:"message",kind:"widgets.base.Spinner",size:25, message: Master.locale.get("LOAD_PORFILE_MENUS", "message")},
		{name:"treeMenu",childNodeKey:"components",selectedItemKey:"key", selectedItemValue:"7",kind:"widgets.menus.TreeMenu", onItemClick:"treeNodeClick", onItemExpandChanged:"treeNodeExpandChanged"},
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{name: "list", classes:"menus-container", showing: false}
	],
	showProfileMenusUI: function (viewModel, data) {
		this.zLog("viewModel", viewModel, "data: ", data);
		// show dock edit categories tree nodes.
		this.showCategoryTree();

		// save current menu  items.
		this.menuItems = viewModel.records;	
		this.selectedKey = data.menuKey;
		var menuComponents = this.prepareMenus();
		this.$.list.destroyClientControls();
		this.$.list.createClientComponents(menuComponents);
		this.$.list.render();
		this.highlightMenuItem();
		this.$.message.hide();
		this.$.list.show();
	},
	showCategoryTree: function () {
		var categories = [
			{key:"1", content: "Alpha", hash:"#profile/api/list", components: [
				{key:"2",hash:"#profile/api/list", content: "Bravo-Alpha"},
				{key:"3",hash:"#profile/api/list", content: "Bravo-Bravo"},
				{key:"4",hash:"#profile/api/list", content: "Bravo-Charlie"}
			]},
			{ key:"5",content: "Bravo",hash:"#profile/api/list", components: [
				{key:"6",hash:"#profile/api/list", content: "Bravo-Alpha"},
				{key:"7",hash:"#profile/api/list", content: "Bravo-Bravo"},
				{key:"8",hash:"#profile/api/list", content: "Bravo-Charlie"}
			]}
		];
		this.$.treeMenu.set("source", categories);
	},
	prepareMenus:function () {
		var menus = [];
		for (var i = 0; i < this.menuItems.length; i++) {
			var menuItem = this.menuItems[i];
			var isSelected = this.selectedKey == menuItem.get("key");
			menus.push({ontap:"menuItemTap",  classes: isSelected?"list-item selected":"list-item", hash: menuItem.get("hash"), components: [
				{ tag:"i" ,hash: menuItem.get("hash"), classes: menuItem.get("customClass")},
				{ tag:"span", hash: menuItem.get("hash"),content: menuItem.get("name")}
			]});
		};
		return menus;
	},
	highlightMenuItem: function () {
		var $controls = this.$.list.getControls();
		for (var i = 0; i < $controls.length; i++) {
			var $menuItem = $controls[i];
			if ($menuItem.hasClass("selected")) {
				this.$.selection.select($menuItem.id, $menuItem);
				break;
			}
		};
	},
	menuItemTap: function (inSender, inEvent) {
		if (inSender) {
			var hash = inSender.get("hash"); 
			this.$.selection.select(inSender.id, inSender);
			this.location(hash);
		} else {
			this.zError("dock menu item tap: item data don't exit!");
		}
		return true;
	},
	select: function(inSender, inEvent) {
		var node = inEvent.data;
		if (node) {
			node.addClass("selected");	
		}
		return true;
	},
	deselect: function(inSender, inEvent) {
		var node = inEvent.data;
		if (node) {
			node.removeClass("selected");
		}
		return true;
	},
	// for tree node 
	// 
	treeNodeClick: function (inSender, inEvent) {
		var loc = inEvent.get("hash");
		this.zLog(loc);
		this.location(loc);
		return true;
	},
	treeNodeExpandChanged: function (inSender, inEvent) {
		// the timeout should > node.css enyo-animate 0.2s+enyo.Node._collapse() settimeout. ==225 minisecond.
		Master.view.frame.notifyTwoColumnLayoutReflow(250);
		return true;
	}
});