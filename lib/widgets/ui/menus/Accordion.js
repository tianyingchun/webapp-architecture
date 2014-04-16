enyo.kind({
	name: "widgets.menus.Accordion",
	classes:"widget-accordion",
	tag:"ul",
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
		selectedKey:"",// default selected key, if matched open the corresponding menu item.
		itemHeight: 35 // the height of single menu child item.
	},
	events: {
		onAccordionViewChanging: "",
		onAccordionViewChanged: ""
	},
	handlers: {
		onInit: "initItem",
		onToggle: "viewChanged",
		onItemToggleAnimated:"itemToggleAnimated"
	},
	items: [],
	activeView:null,// save current activeView.
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.setUpItems();
		};
	}),
	setUpItems: function () {
		for (var i = 0; i < this.source.length; i++) {
			var item = this.source[i];
			var childMaxHeight = item[this.itemChildField] && item[this.itemChildField].length * this.getItemHeight();
			this.createComponent({
				kind: "widgets.menus.accordion.Item",
				headerTitle: item[this.itemNameField],
				headerLink: this.getLocationHash(item),
				contentComponents: this.constructChildComponents(item),
				maxHeight: childMaxHeight
			});
		};
		this.render();
	},
	//*@private check if current item need to collaplsed or opened while first loading accordion menu.
	highlightMenuItem: function () {
		 
	},
	getLocationHash: function (item) {
		var loc = "#";
		if(item && item.isCategoryNode) {
			loc = "#c/"+item[this.itemKeyField];
		} else {
			loc = "#node/"+item[this.itemKeyField];
		}
		return loc;
	},
	constructChildComponents: function (item) {
		var components = [];
		var childs = item[this.itemChildField];
		if(item && childs && childs.length) {
			for (var i = 0; i < childs.length; i++) {
				var child = childs[i];
				components.push({
					tag:"li",
					components:[ 
						{tag:"a", attributes:{href: this.getLocationHash(child)}, content: child[this.itemNameField]}
					]
				});
			};
		}
		return components;
	},
	rendered: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.waterfallDown( "onResizeHeader", {itemHeight: this.itemHeight, itemCount: this.items.length } );	
			this.highlightMenuItem();
		};
	}),
	viewChanged: function(inSender, inEvent) {
		var activeView = this.activeView;
		// Silently close previous activeView, if needed
		if(activeView && this.getHidePrevCollapsed() && activeView.name !==inSender.name) {
			activeView.toggleItem(true);
		}
		this.activeView = inSender;
		this.doAccordionViewChanging(inSender);
	},
	itemToggleAnimated: function (inSender, inEvent) {
		// current active view.
		this.doAccordionViewChanged(this.activeView);
	},
	initItem: function(inSender, inEvent) {
		this.items.push(inSender);
		return true;
	}
});
enyo.kind({
	name: "widgets.menus.accordion.ItemHeader",
	classes: "accordion-header",
	tag:"a",
	events: {
		onInit: "",
		onToggle: ""
	},
	published:{
		href:"#"
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
	tap: function(inSender, inEvent, silent) {
		silent = ((silent === undefined) || (silent === false)) ? false : true;
		this.bubbleUp("onToggle", {silent: silent});
	}
});

enyo.kind({
	name: "widgets.menus.accordion.ItemContent",
	classes: "accordion-content",
	tag:"ul",
	rendered: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.bubble("onAccordionContentInit");
			this.hide();
		};
	})
});

enyo.kind({
	name:"widgets.menus.accordion.Item",
	classes: "accordion-item",
	tag:"li",
	mixins: [
		"Master.ClassSupport"
	],
	events:{
		onItemToggleAnimated:""
	},
	handlers: {
		onInit: "initHeader",
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
			var itemCaretClass = this.contentComponents.length?"icon-caret-right":"";
			var headerComponent = { name:"accordionItemHeader", href:this.headerLink, kind: "widgets.menus.accordion.ItemHeader", components:[
				{tag:"i",classes: itemCaretClass},
				{tag:"span", content: this.headerTitle}
			]};
			//var wrappedComponents = [{kind: "enyo.Scroller", name: "scroller", components: this.contentComponents}];
			var contentComponent = { name:"accordionItemContent", kind: "widgets.menus.accordion.ItemContent", components: this.contentComponents};

			this.createComponents([headerComponent, contentComponent]);
		};
	}), 
	initHeader: function(inSender, inEvent) {
		this.header = inSender;
		//return true; // stop bubbling // but we dont stop so we can see this from Accordion root - is that what we want?
	}, 
	//*@private
	_toggleItem: function(inSender, inEvent) {
		var silent = inEvent.silent;
		(this.getCollapsed()) ? this.showItem(inSender) : this.hideItem(inSender);
		// If silent, don't bubble our onChange/onToggle event
		if (silent) return true;
	},
	//*@ public
	toggleItem: function (silent) {
		this.header.tap(undefined, undefined, silent);
	},
	showItem: function(inSender) {
		this.$.accordionItemContent.show();
		this.$.animator.play({
			startValue:this.getMinHeight(),
			endValue: this.getMaxHeight(),
			node: this.hasNode(),
			collapsed: false
		});
		inSender.addRemoveClass("header-item-highlight", true);
		this.setCollapsed(false);
	},
	hideItem: function(inSender) {
		this.$.animator.play({
			startValue: this.getMaxHeight(),
			endValue: this.getMinHeight(),
			node: this.hasNode(),
			collapsed: true
		});
		inSender.addRemoveClass("header-item-highlight", false);
		this.setCollapsed(true);
	},
	animatorStep: function(inSender, inEvent) {
		//console.log(inSender, inEvent);
		this.$.accordionItemContent.applyStyle("height", inSender.value + "px");
		return true;
	},
	animatorComplete: function(inSender, inEvent) {
		if (inEvent.originator.collapsed) {
			this.$.accordionItemContent.hide();
		}
		this.doItemToggleAnimated();
		return true;
	},
	resizeHeader: function(inSender, props) {
		this.headerHeight = this.$.accordionItemHeader.getBounds().height;
		//this.applyHeight(props.itemHeight, props.itemCount);
		return true;
	}
	//,
	// applyHeight: function(itemHeight, itemCount) {
	// 	if ((this.hasNode()) && (this.header.hasNode())) {
	// 		// console.log(this.hasNode().getBoundingClientRect());
	// 		this.setMaxHeight(itemHeight * (itemCount-1));
	// 		this.setMinHeight(this.headerHeight);
	// 	} 
	// }
});
