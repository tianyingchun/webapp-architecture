enyo.kind({
	name: "Master.views.shared.DockProfiles",
	kind: "Master.View",
	classes: "dock-profile-meus",
	events: {
		"onFetchApiAvailableCategories":""
	},
	handlers:{
		"onItemClick":"_treeNodeClick",
		"onItemExpandChanged":"_treeNodeExpandChanged"
	},
	components:[
		{name:"message",kind:"widgets.base.Spinner",size:25, message: Master.locale.get("LOAD_PORFILE_MENUS", "message")},
		{kind: "Signals", onTreeMenuUpdated: "treeMenuUpdated"},
		{name:"treeMenu",childNodeKey:"children",selectedItemKey:"hash", kind:"widgets.menus.TreeMenu"},
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{name: "list", classes:"menus-container", showing: false}
	],
	//*@override before view render or re-render phase.
	viewReady: function (){
		this.$.message.show();
		this.$.list.hide();
	},
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
	treeMenuUpdated: function (inSender, inEvent) {
		//deal with enyo.Signals.send("onTreeMenuUpdated", inEvent);
		this.showCategoryTree();
	},
	showCategoryTree: function () {
		var config = {
			viewPage: "api",
			editModel: false,
			viewKind:"shared.DockProfiles" //
		};
		this.doFetchApiAvailableCategories(config);
	},
	showAvalilableCategories: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		var records = viewModel.records;
		this.$.treeMenu.set("itemConverter", this._treeItemConverter)
		// check if current user has selected tree node item. keep it if have. otherwise use window.location(refresh page)
		var currHash = this.__userJustSelectedHash || window.location.hash;

		this.$.treeMenu.set("selectedItemValue", currHash);
		this.$.treeMenu.set("source", records);
	},
	_treeItemConverter: function (item) {
		return {
			//_id: item.id,// 不能用id.因为ENYO 里面组件查找是通过ID 来的容易照成冲突 非常重要。 所以在使用组建的时候一定不能用Id
			content: item.name,
			expaned: item.expaned,
			hash: item.children && item.children.length ? "#profile/node/list/"+item.id: "#profile/node/"+item.id
		};
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
	_treeNodeClick: function (inSender, inEvent) {
		var loc = inEvent.get("hash");
		// save user selected hash value.
		this.__userJustSelectedHash = loc;
		this.zLog(loc);
		this.location(loc);
		return true;
	},
	_treeNodeExpandChanged: function (inSender, inEvent) {
		// the timeout should > node.css enyo-animate 0.2s+enyo.Node._collapse() settimeout. ==225 minisecond.
		Master.view.frame.notifyTwoColumnLayoutReflow(250);
		return true;
	}
});