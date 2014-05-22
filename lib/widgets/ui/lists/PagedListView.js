enyo.kind({
	name:"widgets.lists.PagedListView",
	classes:"widgets-paged-listview",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		source: [],
		showPager: true,
		pageIndex: 1,
		pageSize: 10,
		recordsTotal: 100, 
		pagerUri: "",
		itemClickKeyProperty: "",// the listview item click event indicating property.
		itemDataTemplate: enyo.nop
	},
	events: {
		"onRowItemClick":"",
		"onRenderComplete":""
	},
	components: [
		{name:"contentBody", classes:"pagedlist-content"},
		{name:"pager", kind:"widgets.lists.Pager", dynamicPagerLink:false, classes: "pagination pagedlist-pager"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			//
			this.sourceChanged();
		};
	}),
	refresh: function () {
		this.sourceChanged();
	},
	sourceChanged: function () {
		this.$.contentBody.destroyClientControls();
		this.$.pager.destroyClientControls();
		//render table rows.
		this.renderListItem();
		if(this.getShowPager()) { 
			// render pagers
			this.renderPager();
		}
		this.render();
	}, 
	// render list body.
	renderListItem: function () { 
		var components = [];
	 	for (var i = 0; i < this.source.length; i++) {
	 		var item = this.source[i];
	 		var itemConverter = this.itemDataTemplate;
	 		var scope = this.parent || this;
	 		if (enyo.isString(itemConverter)) {
	 			itemConverter = scope && scope[itemConverter];
	 		}
	 		if (enyo.isFunction(itemConverter)){
	 			var newItem = itemConverter.apply(scope, [item, i]);
		 		enyo.mixin(newItem, {
		 			rowItemIndex: i,
		 			ontap:"rowItemTap"
		 		});
	 			components.push(newItem);
	 		} else {
	 			this.zError("you must specific an item converter function!");		 		
	 		}
	 	};
	 	this.$.contentBody.createClientComponents(components);
	 	// bubble render 
		this.doRenderComplete();
	},	
	renderPager: function () {
		if (this.source.length) {
			this.$.pager.show();
			this.$.pager.setItems(this.recordsTotal);
			this.$.pager.setItemsOnPage(this.pageSize);
			this.$.pager.setCurrentPage(this.pageIndex);
			this.$.pager.setHrefTextPrefix(this.pagerUri);
			this.$.pager.reInit();
		} else {
			this.$.pager.hide();
		}
	},
	rowItemTap: function (inSender, inEvent) {
		$originator = inEvent.originator;
		if ($originator[this.itemClickKeyProperty]) {
			this.doRowItemClick($originator);
		}
		return true;
	}
});