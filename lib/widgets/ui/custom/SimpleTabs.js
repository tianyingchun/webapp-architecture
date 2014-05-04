enyo.kind({
	name: "widgets.custom.SimpleTabs",
	classes: "simple-tabs",
	mixins:[
		"Master.ClassSupport"
	],
	published: {
		headerComponents: [],
		contentComponents: [],
		// defaulkt selected index.
		selectedIndex: 0
	},
	components: [
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{name:"header", classes:"header-container btn-group"},
		{name:"content",classes:"tab-content"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.init();
		};
	}),
	init: function () {
		// create tab headers.
		this.createTabHeader();
		// create tab content.
		this.createTabContent();
		// highlight default content item.
		this.highLightDefaultItem();
	},
	createTabHeader: function() { 
		var _components = [];
		for (var i = 0; i < this.headerComponents.length; i++) {
			var headerItem =enyo.clone(this.headerComponents[i]);
			headerItem.classes = this.selectedIndex==i? "active btn btn-default" : "btn btn-default";
			headerItem.kind = "enyo.Button";
			headerItem.itemIndex = i;
			headerItem.ontap="tabItemClick";
			headerItem.name = "tab-header-"+i;
			_components.push(headerItem);
		};
		this.$.header.createClientComponents(_components);
		this.$.header.render();
	},
	createTabContent: function () {
		var _components = [];
		for (var i = 0; i < this.contentComponents.length; i++) {
			var contentItem =enyo.clone(this.contentComponents[i]);
			contentItem.classes = this.selectedIndex==i? "active content-item" : "content-item";
			contentItem.itemIndex = i;
			contentItem.name = "tab-content-"+i;
			_components.push(contentItem);
		};
		this.$.content.createClientComponents(_components);
		this.$.content.render();
	},
	tabItemClick: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		var itemIndex = $originator.itemIndex;
		var contentName = "tab-content-"+itemIndex;
		var $content = this.$[contentName];
		if ($content) {
			this.$.selection.select($content.id, $content);
		} else {
			this.zError("can't find content item index: `"+itemIndex+"` in SimpleTabs widget!");
		}

		return true;
	},
	//*@public 
	setActiveIndex: function (index) {
		var $content = this.$["tab-content-"+index];
		if ($content) {
			this.$.selection.select($content.id, $content); 
		} else {
			this.zError("can't find content item index: `"+itemIndex+"` in SimpleTabs widget!");
		}
	},
	//*@private.
	highLightDefaultItem: function (itemIndex) {
		itemIndex = itemIndex || this.selectedIndex;
		var $controls = this.$.content.getControls();
		var $selectedItem = $controls[itemIndex];
		if ($selectedItem) {
			this.$.selection.select($selectedItem.id, $selectedItem);
		} else {
			this.zError("can't find content item index: `"+itemIndex+"` in SimpleTabs widget!");
		}
	},
	select: function(inSender, inEvent) {
		var node = inEvent.data;
		var itemIndex = node.itemIndex;
		var $headerItem = this.$["tab-header-"+itemIndex];
		if ($headerItem) {
			$headerItem.addClass("active");
		}
		if (node) {
			node.addClass("active");	
		} 
		return true;
	},
	deselect: function(inSender, inEvent) {
		var node = inEvent.data;
		var itemIndex = node.itemIndex;
		var $headerItem = this.$["tab-header-"+itemIndex];
		if ($headerItem) {
			$headerItem.removeClass("active");
		}
		if (node) {
			node.removeClass("active");
		}
		return true;
	}
});