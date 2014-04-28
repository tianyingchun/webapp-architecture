enyo.kind({
	name: "widgets.menus.TreeMenu", 
	classes: "widget-treemenu",
	mixins: [
		"Master.ClassSupport",
		"Master.HistorySupport"
	],
	published :{
		source: [],
		childNodeKey: "childs",
		selectedItemKey: "hash",
		//normally it's current location hash.
		selectedItemValue: "",
		itemConverter: null,

		onlyIconExpands: false,
		icon: "",
		expandedIcon: ""
	}, 
	handlers: {
		onNodeTap: "nodeTap",
		onExpand: "nodeExpand",
		onItemSelected:"itemSelectedChanged"
	},
	events: {
		onItemClick:"",
		onItemExpandChanged:""
	},
	components: [
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{ name:"treenode", kind:"enyo.Node", onlyIconExpands:this.onlyIconExpands, icon: this.expandedIcon, content: "Tree",expandable: true, expanded: true}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.init();
		}
	}),
	//*@ initialize components parameters.
	init: function () {
		// define root node.
		this._rootNode = {};
		// for testing purpose.
		this.source = [
			{content: "Alpha", hash:"#profile/api/list", components: [
				{hash:"#profile/api/list", content: "Bravo-Alpha"},
				{hash:"#profile/api/list", content: "Bravo-Bravo"},
				{hash:"#profile/api/list", content: "Bravo-Charlie"}
			]},
			{ content: "Bravo",hash:"#profile/api/list", components: [
				{hash:"#profile/api/list", content: "Bravo-Alpha"},
				{hash:"#profile/api/list", content: "Bravo-Bravo"},
				{hash:"#profile/api/list", content: "Bravo-Charlie"}
			]}
		];
		this.childNodeKey = "components";
		this.selectedItemKey = "hash";
		this.selectedItemValue= "4";
		// for testing purpose end.
		// 
		// invoke source changed.
		this.souceChanged();
	},
	souceChanged: function () {
		// draw child item components.
		this.$.treenode.destroyClientControls();
		this.prepareTreeDataSource(this.source, this._rootNode);
		//
		this.$.treenode.addNodes(this._rootNode.components);
	},
	prepareTreeDataSource: function (source, node) {
		for (var i = 0; i < source.length; i++) {
			var nodeData = source[i],
				childs = nodeData[this.childNodeKey];
			// convert current item.
			node.components = node.components || [];
			var newNode = this._prepareTreeNode(node, nodeData, childs);
			node.components.push(newNode);

			if (childs && childs.length) {
				this.prepareTreeDataSource(childs, newNode);
			}
		};
	},
	/**
	 * Prepare tree ndoe data
	 * @param  {object} pNode  parent node.
	 * @param  {object} node   current node
	 * @param  {array} childs child nodes of current node.
	 * @return {object}        current new node
	 */
	_prepareTreeNode: function (pNode, node, childs) {
		var converter = this.itemConverter || function (node) {
			return {
				icon: this.icon, hash: node.hash, content: node.content
			};
		};
		var newNode = converter(node);

		if (childs && childs.length) {
			newNode.expandable = true;
		}
		if (node[this.selectedItemKey] == this.selectedItemValue) {
			pNode.expanded = true;
			newNode.icon = this.expandedIcon;
		}
		return newNode;
	},
	select: function(inSender, inEvent) {
		var node = inEvent.data;
		if (node) {
			node.addClass("selected");	
			this.doItemClick(node);
		}
		return true;
		// this.zLog("inEvent", inEvent);
	},
	deselect: function(inSender, inEvent) {
		// this.zLog("inEvent", inEvent);
		var node = inEvent.data;
		if (node) {
			node.removeClass("selected");
		}
		return true;
	},
	itemSelectedChanged: function(inSender, inEvent) {
		if(inEvent.selected) {
			var node = inEvent.originator;
			this.$.selection.select(node.id, node);
		}
		return true;
	},
	nodeTap: function (inSender, inEvent) {
		var node = inEvent.originator;
		// this.zLog(node.id, node);
		this.$.selection.select(node.id, node);
		return true;
	},
	nodeExpand: function (inSender, inEvent) {
		 // var node = inEvent.originator;
		var isExpanded = inSender.expanded;
		inSender.addRemoveClass("expanded", isExpanded);
		var arrowPath = "assets/images/" + (isExpanded ? "arrow-open.png" : "arrow.png");
		inSender.setIcon(arrowPath);
		this.doItemExpandChanged({isExpanded:isExpanded});
		return true;
	}
})