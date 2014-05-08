enyo.kind({
	name: "widgets.menus.Accordion",
	tag:"ul",
	classes:"widget-accordion",
	mixins: [
		"Master.ClassSupport",
		"Master.HistorySupport"
	], 
	published: {
		hidePrevCollapsed: false,
		source: [],
		itemNameField: "name",
		itemKeyField:"key",
		itemChildField:"childs",
		itemExpendedField:"isExpanded",
		linkConverterFn:"",
		selectedKey:"",// default selected key, if matched open the corresponding menu item.
		itemHeight: 37 // the height of single menu child item.
	},
	events: {
		onAccordionViewChanging: "",
		onAccordionViewChanged: ""
	},
	handlers: {
		onInit: "_initItem",
		onToggle: "viewChanging",
		onItemToggleAnimated:"itemToggleAnimated"
	},
	components: [
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"}	
	],
	items: [],
	activeView:null,// save current activeView.
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.setUpItems();
		};
	}),
	rendered: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// this.waterfallDown( "onResizeHeader", {itemHeight: this.itemHeight, itemCount: this.items.length } );	
			this.highlightMenuItem();
		};
	}),
	_initItem: function(inSender, inEvent) {
		this.items.push(inSender);
		return true;
	},
	setUpItems: function () {
		for (var i = 0; i < this.source.length; i++) {
			var item = this.source[i];
			var childMaxHeight = item[this.itemChildField] && item[this.itemChildField].length * this.getItemHeight();
			this.createComponent({
				kind: "widgets.menus.accordion.Item",
				headerTitle: item[this.itemNameField],
				headerLink: this.getLocationHash(item),
				contentComponents: this.constructChildComponents(item),
				maxHeight: childMaxHeight,
				collapsed: !item[this.itemExpendedField]
			});
		};
		// this.render(); Don't exec render here, it will result to rendered() executed twice.
	},
	//*@private check if current item need to collapsed or opened while first loading accordion menu.
	highlightMenuItem: function () {
		this.zLog("find matched selected menu item...");
		var $controls = this.getControls();
		for (var i = 0; i < $controls.length; i++) {
			var $item = $controls[i];
			//widgets.menus.accordion.Item->searchMenuItem
			var $matchedMenuItem = $item.searchMenuItem(this.selectedKey);
			if ($matchedMenuItem === true) {
				break;
			}
		};
	},
	getLocationHash: function (item) {
		var loc = "#";
		if(this.linkConverterFn && enyo.isFunction(this.linkConverterFn)) {
			loc = this.linkConverterFn(item);
		} 
		return loc;
	},
	//*@private construct child components.
	constructChildComponents: function (item) {
		var components = [];
		var childs = item[this.itemChildField];
		if(item && childs && childs.length) {
			for (var i = 0; i < childs.length; i++) {
				var child = childs[i];
				components.push({
					tag:"li",
					hash:this.getLocationHash(child),
					components:[ 
						{tag:"a", attributes:{href: this.getLocationHash(child)}, content: child[this.itemNameField]}
					]
				});
			};
		}
		return components;
	},

	select: function(inSender, inEvent) {
		var node = inEvent.data;
		if (node) {
			node.addClass("selected");	
		}
		return true;
	},
	deselect: function(inSender, inEvent) {
		// this.zLog("inEvent", inEvent);
		var node = inEvent.data;
		if (node) {
			node.removeClass("selected");
		}
		return true;
	},
	viewChanging: function(inSender, inEvent) {
		var activeView = this.activeView;
		// Silently close previous activeView, if needed
		if(activeView && this.getHidePrevCollapsed() && activeView.name !== inSender.name) {
			activeView.toggleItem(true);
		}
		this.activeView = inSender;
		// add "selected" class to link node.
		var linkNode = inEvent.linkNode;
		if(linkNode) {
			this.$.selection.select(linkNode.id, linkNode);
		}
		this.doAccordionViewChanging(inSender);
	},
	itemToggleAnimated: function (inSender, inEvent) {
		// current active view.
		this.doAccordionViewChanged(this.activeView);
	}

});
// `item header` control for accordion widget.
enyo.kind({
	name: "widgets.menus.accordion.ItemHeader",
	tag:"a",
	classes: "accordion-header",
	published:{
		href:"#"
	},
	events: {
		onInit: "",
		onToggle: ""
	},
	//* @protected
	handlers: {
		ontap: "tap"
	},
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.hrefChanged();
		};
	}),
	rendered: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.bubbleUp("onInit");
		};
	}),
	hrefChanged: function (){
		this.setAttribute("href", this.href);
	},
	tap: function(inSender, inEvent, silent, linkNode) {
		silent = ((silent === undefined) || (silent === false)) ? false : true;
		this.bubbleUp("onToggle", {silent: silent, linkNode: linkNode || this});
	}
});
// `item content` control for accordion widget.
enyo.kind({
	name: "widgets.menus.accordion.ItemContent",
	tag:"ul",
	classes: "accordion-content",
	showing:false,
	rendered: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.bubble("onAccordionContentInit");
		};
	})
});
// `item` control for accordion widget.
enyo.kind({
	name:"widgets.menus.accordion.Item",
	tag:"li",
	classes: "accordion-item",
	mixins: [
		"Master.ClassSupport"
	],
	events:{
		onItemToggleAnimated:""
	},
	handlers: {
		ontap:"_childMenuItemTap",
		onInit: "_initHeader",
		onToggle: "_toggleItem",
		onResizeHeader: "resizeHeader" // waterfall event.
	},
	published:{
		collapsed: true,
		maxHeight: 0,
		minHeight: 0,
		headerTitle: "no menu header defined",
		headerLink:"#",
		contentComponents: []
	},
	header: null,
	//* @protected
	components: [
		{name:"animator", kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// item caret class
			var itemCaretClass = this.contentComponents.length ? "icon-caret-right":"";
			var headerClasses = this.collapsed ? "collapsed ":"open";
			if(this.contentComponents.length) {
				headerClasses=headerClasses+" has-childs accordion-header";
			} else {
				headerClasses=headerClasses+" accordion-header";
			}
			var headerComponent = { 
				name:"accordionItemHeader",
				kind: "widgets.menus.accordion.ItemHeader", 
				classes: headerClasses,
				href:this.headerLink, components:[
					{tag:"i",classes: itemCaretClass},
					{tag:"span", content: this.headerTitle}
				]
			};
			//var wrappedComponents = [{kind: "enyo.Scroller", name: "scroller", components: this.contentComponents}];
			var contentComponent = { 
				name:"accordionItemContent", 
				kind: "widgets.menus.accordion.ItemContent",
				showing: !this.collapsed, 
				components: this.contentComponents
			};

			this.createComponents([headerComponent, contentComponent]);
		};
	}),
	_initHeader: function(inSender, inEvent) {
		this.header = inSender;
		return true; // stop bubbling // but we dont stop so we can see this from Accordion root - is that what we want?
	}, 
	_childMenuItemTap: function (inSender, inEvent) {
		var originator = inEvent.originator;
		if (originator.tag.toLowerCase() === "a") {
			this.bubbleUp("onToggle", { silent: true, linkNode: originator });
		} 
		return true;
	},
	//*@private
	_toggleItem: function(inSender, inEvent) {
		var silent = inEvent.silent;
		(this.getCollapsed()) ? this.showItem(inSender) : this.hideItem(inSender);
		// If silent, don't bubble our onChange/onToggle event
		if (silent) return true;
	},
	/**
	 * @public
	 * @param  {string} hash url	
	 * @return {object} enyo control <a> link.
	 */
	searchMenuItem: function (hash) {
		var find = false;
		var $childItems = this.$.accordionItemContent.getControls();
		var $menuHeader = this.$.accordionItemHeader;
		if($menuHeader.getHref() === hash) { 
			// if current item has collapsed.toggle it.
			if(this.getCollapsed()) {
				this.toggleItem(false, $menuHeader);
			} else {
				this.bubbleUp("onToggle", { silent: true, linkNode: $menuHeader });
			}
			// add class to header item.
			find = true;
		} else { 
			for (var i = 0; i < $childItems.length; i++) {
				var menu = $childItems[i];
				if(menu.hash == hash) {
					find = true;
					var linkNode = menu && menu.getControls()[0];
					// if current item has collapsed.toggle it.
					if(this.getCollapsed()) {
						this.toggleItem(false, linkNode);
					} else {
						this.bubbleUp("onToggle", { silent: true, linkNode: linkNode });
					}
					// add classes to child item.
					break;
				}
				// this.zLog(menu.hash,hash);
			};
		}
		return find;
	},
	//*@ public
	toggleItem: function (silent, linkNode) {
		this.header.tap(undefined, undefined, silent, linkNode);
	},
	//*@protected.
	showItem: function(inSender) {
		this.$.accordionItemContent.show();
		this.$.animator.play({
			startValue:this.getMinHeight(),
			endValue: this.getMaxHeight(),
			node: this.hasNode(),
			collapsed: false
		});
		inSender.addRemoveClass("collapsed", false);
		inSender.addRemoveClass("open", true);

		this.setCollapsed(false);
	},
	//*@protected.
	hideItem: function(inSender) {
		this.$.animator.play({
			startValue: this.getMaxHeight(),
			endValue: this.getMinHeight(),
			node: this.hasNode(),
			collapsed: true
		});
		inSender.addRemoveClass("collapsed", true);
		inSender.addRemoveClass("open", false);

		this.setCollapsed(true);
	},
	//*@private
	animatorStep: function(inSender, inEvent) {
		this.$.accordionItemContent.applyStyle("height", inSender.value + "px");
		return true;
	},
	//*@private
	animatorComplete: function(inSender, inEvent) {
		if (inEvent.originator.collapsed) {
			this.$.accordionItemContent.hide();
		}
		this.doItemToggleAnimated();
		return true;
	},
	//*@private
	resizeHeader: function(inSender, props) {
		// this.headerHeight = this.$.accordionItemHeader.getBounds().height;
		return true;
	}
});
