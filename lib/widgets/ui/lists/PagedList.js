enyo.kind({
	name:"widgets.lists.PagedList",
	classes:"widgets-pagedlist",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		source: [],
		showPager: true,
		pageIndex: 1,
		pageSize: 10,
		recordsTotal: 100,
		fields: [],// specific the fields that can be shown
		header: [],
		rowKeyField:"",
		pagerUri: "",
		// can be null, disable all action buttons.
		actions:{
			add: { enabled: true, text: "添加",classes:"btn-small" },
			edit: { enabled:true, text: "修改",classes:"btn-primary btn-small" },
			remove:{ enabled: true, text: "删除",classes:"btn-danger btn-small"}
		}
	},
	handlers:{
		onPageClick: "pageNumberTap"
	},
	components: [
		{name:"contentBody",tag:"table", classes:"pagedlist-content"},
		{name:"pager", kind:"widgets.lists.Pager", dynamicPagerLink:false, classes: "pagination pagedlist-pager"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			//
		};
		this.sourceChanged();
	}),
	sourceChanged: function () {
		this.$.contentBody.destroyClientControls();
		this.$.pager.destroyClientControls();
		//render table rows.
		this.renderTableRows();
		if(this.getShowPager()) { 
			// render pagers
			this.renderPager();
		}
		this.render();
	}, 
	// render list body.
	renderTableRows: function () { 
		var tableComponents = this.renderTableHead(); 
	 	tableComponents = tableComponents.concat(this.renderTableBody());
	 	this.$.contentBody.createComponents(tableComponents);
	},	
	renderPager: function () {
		this.$.pager.setItems(this.recordsTotal);
		this.$.pager.setItemsOnPage(this.pageSize);
		this.$.pager.setCurrentPage(this.pageIndex);
		this.$.pager.setHrefTextPrefix(this.pagerUri);
		this.$.pager.init();
	},
	renderTableHead: function () {
		var headerComponents = [];
		var ths = [];
		for (var i = 0; i < this.header.length;i++) {
			var thItem = this.header[i];
			ths.push({ tag:"td", classes: thItem.toLowerCase(), content: thItem });
		};
		headerComponents.push({ tag:"tr", classes:"header", components: ths });
		return headerComponents;
	},
	renderTableBody: function () {
		var bodyComponents = [];
		if(this.source && this.source.length) {
			for (var i = 0; i < this.source.length; i++) {
				var item = this.source[i];
				bodyComponents.push({ 
					kind:"widgets.lists.pagedlist.TableRow", 
					fields: this.fields, 
					item: item, rowKeyField:this.rowKeyField,
					actions: this.actions
				});
			};
		}
		return bodyComponents;
	},

	// *@ capture page number button clicked.
	pageNumberTap: function (inSender, inEvent) {
		this.zLog(1,inEvent);
		return true;
	}
});


enyo.kind({
	name:"widgets.lists.pagedlist.TableRow",
	published:{
		item: null,
		// used to store privary key for each row item.
		rowKeyField: "",
		// can be null, disable all action buttons.
		actions:{
			add: { enabled: true, text: "添加",classes:"btn-small" },
			edit: { enabled:true, text: "修改",classes:"btn-primary btn-small" },
			remove:{ enabled: true, text: "删除",classes:"btn-danger btn-small"}
		},
		// will only display data value it can be find in this. fields.
		fields: []
	},
	events: {
		onActionButtonTap:""
	},
	rowKey:"",
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.rowKey = this.item[this.rowKeyField];
			this.renderRowCells();
		};
	}),
	renderRowCells: function () {
		var cells = [], item = this.item;
		for(var cell in item) {
			if(this.ifFieldCanbeShow(cell)) {
				cells.push({ tag:"td", classes:cell.toLowerCase(), content: item[cell]});
			}
		}
		//action buttons available.
		if(this.actions != null) {
			var actionComponents = [];
			for (var action in this.actions) {
				var actionItem = this.actions[action];
				if (actionItem && actionItem.enabled) {
					if(action == "add") { 
						actionComponents.push(this.getActionButton("add", actionItem.text,actionItem.classes, "icon-plus"));
					} else if(action == "edit") {
					 	actionComponents.push(this.getActionButton("edit", actionItem.text,actionItem.classes,"icon-edit"));
					} else if (action == "remove") {
						actionComponents.push(this.getActionButton("remove", actionItem.text,actionItem.classes,"icon-trash"));
					} 
				}
			}
			cells.push({ tag: "td", classes:"action-btns", components: actionComponents });
		}
		this.createComponent({tag:"tr", components: cells});
	},
	ifFieldCanbeShow: function (cell) {
		var show = false || this.fields===null;
		if(this.fields) {
			for (var i = 0; i < this.fields.length; i++) {
				var field = this.fields[i];
				if(field.toLowerCase() == cell.toLowerCase()) {
					show = true;
					break;
				}
			};
		}
		return show;
	},
	getActionButton: function (action, txt, btnclasses, iconclasses) {
		var action = {
			tag:"a", 
			classes:"btn "+btnclasses,
			ontap:"actionTap", 
			action:action, 
			components: [
				{tag:"i", action:action, classes:iconclasses},
				{tag:"span", action:action,content:txt}
			]
		};
		return action;
	},
	actionTap: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		var _inEvent = {
			key: this.get("rowKey"),
			action: $originator.get("action")
		};
		this.doActionButtonTap(_inEvent);
		return true;
	}
});