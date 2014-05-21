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
		itemDataTemplate: enyo.nop
	},
	handlers:{
		onPageClick: "pageNumberTap"
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
	 			var newItem = itemConverter.apply(scope, [item]);
		 		enyo.mixin(newItem, {
		 			rowItemIndex: i,
		 			__action: "__listviewitem",
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
		this.$.pager.setItems(this.recordsTotal);
		this.$.pager.setItemsOnPage(this.pageSize);
		this.$.pager.setCurrentPage(this.pageIndex);
		this.$.pager.setHrefTextPrefix(this.pagerUri);
		this.$.pager.init();
	},
	rowItemTap: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		if ($originator.__action == "__listviewitem") {
			this.doRowItemClick($originator);
		}
		return true;
	},
	// *@ capture page number button clicked.
	pageNumberTap: function (inSender, inEvent) {
		this.zLog(1,inEvent);
		return true;
	}
});