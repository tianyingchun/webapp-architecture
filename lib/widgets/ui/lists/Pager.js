enyo.kind({
	name:"widgets.lists.Pager",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		items: 1,//Total number of items that will be used to calculate the pages.
		itemsOnPage: 1,//Number of items displayed on each page.
		pages: 0,//If specified, items and itemsOnPage will not be used to calculate the number of pages.
		displayedPages: 5,//How many page numbers should be visible while navigating.Minimum allowed: 3 (previous, current & next)
		edges: 2,//How many page numbers are visible at the beginning/ending of the pagination.
		currentPage:1,//Which page will be selected immediately after init.,
		hrefTextPrefix:"",//#page-
		hrefTextSuffix:"",
		dynamicPagerLink:true, // if true each page number will be dynamic.
		prevText:"Prev",
		nextText:"Next",
		ellipseText: '...',
		cssStyle: 'light-theme'
	},
	events: {
		onInit: "",// Callback triggered immediately after initialization
		onPageClick:"" // inEvent:{pageIndex:xx}
	},
	handlers: {
		ontap:"pageNumberTap"
	},
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
		};
	}),
	init: function () {
		this.pages = this.pages ? this.pages : Math.ceil(this.items / this.itemsOnPage) ? Math.ceil(this.items / this.itemsOnPage) : 1;
		this.currentPage = this.currentPage? this.currentPage-1: 0; 
		this.halfDisplayed = this.displayedPages / 2;
		this._draw();
		// bubble.
		this.doInit();
	},
	//*@public
	selectPage: function(page) {
		this._selectPage(page - 1);
	},
	//*@public
	prevPage: function() {
		if (this.currentPage > 0) {
			this._selectPage(this.currentPage - 1);
		}
	},
	//*@public
	nextPage: function() { 
		if (this.currentPage < this.pages - 1) {
			this._selectPage(this.currentPage + 1);
		}
	},
	//*@public
	getPagesCount: function() {
		return this.pages;
	},
	// page number from 1,2,3...
	drawPage: function (page) {
		this.setCurrentPage(page - 1);
		this._draw();
	},
	redraw: function(){
		this._draw();
	},
	//*@ updateItems.
	updateItems: function (newItems) {
		this.setItems(newItems);
		this.setPages(this._getPages());
		this._draw();
	},
	updateItemsOnPage: function (itemsOnPage) {
		this.setItemsOnPage(itemsOnPage);
		this.setPages(this._getPages());
		this._selectPage(0);
	},
	_getPages: function() {
		var pages = Math.ceil(this.getItems() / this.getItemsOnPage());
		return pages || 1;
	},
	_getInterval: function() {
		return {
			start: Math.ceil(this.currentPage > this.halfDisplayed ? Math.max(Math.min(this.currentPage - this.halfDisplayed, (this.pages - this.displayedPages)), 0) : 0),
			end: Math.ceil(this.currentPage > this.halfDisplayed ? Math.min(this.currentPage + this.halfDisplayed, this.pages) : Math.min(this.displayedPages, this.pages))
		};
	},
	_selectPage: function(pageIndex) {
		this.setCurrentPage(pageIndex);
		this._draw();
		// bubble page event
		this.doPageClick({pageNumber: pageIndex+1});
	},
	_draw: function () { 
		// desctroy controls.
		this.destroyClientControls();
		var interval = this._getInterval(),
			components = [];

		if(this.getPrevText()) {
			// Generate Prev link
			components.push(this._appendItem(this.getCurrentPage() - 1, {text: this.getPrevText(), classes: 'prev'}));
		}
		if (interval.start > 0 && this.getEdges() > 0) {
			var end = Math.min(this.getEdges(), interval.start);
			for (i = 0; i < end; i++) {
				components.push(this._appendItem(i));
			}
			if (this.getEdges() < interval.start && (interval.start - this.getEdges() != 1)) {
				components.push({
					tag:"li", classes:"disabled", components: [
					 	{tag:"span", classes:"ellipse", content:this.getEllipseText()}
					]
				});
			} else if (interval.start - this.getEdges() == 1) {
			 	components.push(this._appendItem(this.getEdges()));
			}
		}
		// Generate interval links
		for (i = interval.start; i < interval.end; i++) {
		 	components.push(this._appendItem(i));
		}
		// Generate end edges
		if (interval.end < this.getPages() && this.getEdges() > 0) {
			if (this.getPages() - this.getEdges() > interval.end && (this.getPages() - this.getEdges() - interval.end != 1)) {
				components.push({
					tag:"li", classes:"disabled", components: [
					 	{tag:"span", classes:"ellipse", content:this.getEllipseText()}
					]
				});
			} else if (this.getPages() - this.getEdges() - interval.end == 1) {
				this._appendItem(interval.end);
			}
			var begin = Math.max(this.getPages() - this.getEdges(), interval.end);
			for (i = begin; i < this.getPages(); i++) {
				components.push(this._appendItem(i));
			}
		}

		// Generate Next link (unless option is set for at front)
		if (this.getNextText()) {
			components.push(this._appendItem(this.getCurrentPage() + 1, {text: this.getNextText(), classes: 'next'}));
		}

		this.createComponent({
			tag:"ul",
			classes: this.getCssStyle(),
			components:components
		});
		this.render();
	},
	// get component object.
	_appendItem: function (pageIndex, config) {
		var $item = { tag: "li" };
		pageIndex = pageIndex < 0 ? 0 : (pageIndex < this.getPages() ? pageIndex : this.getPages() - 1);
		config = enyo.mixin({ text: pageIndex+1, classes:""}, config);

		if(pageIndex == this.getCurrentPage()) {
			if (config.disabled) {
				$item.classes = "disabled";
			} else {
				$item.classes = "active";
			}
			$item.components =[
				{tag:"span", classes:"current", content: config.text}
			];
			
		} else {
			var linkHref = this.getHrefTextPrefix()+(pageIndex+1)+this.getHrefTextSuffix();
			if(!this.getDynamicPagerLink()){
				linkHref = this.getHrefTextPrefix()+this.getHrefTextSuffix();
			}
			$item.components = [
				{tag:"a", attributes: {href:linkHref}, pageIndex: pageIndex, classes:"page-link", content: config.text}
			];	
		}
		return $item;
	},
	pageNumberTap: function (inSender, inEvent) {
		var originator = inEvent.originator;
		if(originator.tag.toLowerCase()==="a") {
			this._selectPage(originator.pageIndex);
		}
		return true;
	}
});