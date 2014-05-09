enyo.kind({
	name: "widgets.menus.TreeMenu", 
	classes: "widget-treemenu",
	mixins: [
		"Master.ClassSupport"
	],
	published:{
		source: [],
		childNodeKey: "childs",
		selectedItemKey: "hash",
		//normally it's current location hash.
		selectedItemValue: "",
		itemConverter: null,

		onlyIconExpands: true,
		folderIcon: "assets/images/folder.png",
		folderOpenIcon: "assets/images/folder-open.png",
		fileIcon: "assets/images/file.png"
	}, 
	handlers: {
		onNodeTap: "nodeTap",
		onExpand: "nodeExpand"
	},
	events: {
		onItemClick:"",
		onItemExpandChanged:""
	},
	components: [
		{ kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{ name:"treenode", kind:"enyo.Node", onlyIconExpands:this.onlyIconExpands, content: "Root",expandable: true, expanded: true}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.init();
		}
	}),
	//*@ initialize components parameters.
	init: function () {
		// set tree default icon for root node.
		this.$.treenode.set("icon", this.folderOpenIcon); 
		// // for testing purpose.
		// this.source = [
		// 	{key:"1", content: "Alpha", hash:"#profile/api/list", components: [
		// 		{key:"2",hash:"#profile/api/list", content: "Bravo-Alpha"},
		// 		{key:"3",hash:"#profile/api/list", content: "Bravo-Bravo"},
		// 		{key:"4",hash:"#profile/api/list", content: "Bravo-Charlie"}
		// 	]},
		// 	{ key:"5",content: "Bravo",hash:"#profile/api/list", components: [
		// 		{key:"6",hash:"#profile/api/list", content: "Bravo-Alpha"},
		// 		{key:"7",hash:"#profile/api/list", content: "Bravo-Bravo"},
		// 		{key:"8",hash:"#profile/api/list", content: "Bravo-Charlie"}
		// 	]}
		// ];
		// this.childNodeKey = "components";
		// this.selectedItemKey = "key";
		// this.selectedItemValue= "4";
		// for testing purpose end.
		// 
		// invoke source changed.
		this.sourceChanged();
	},
	sourceChanged: function () {
		if(this.source && this.source.length) {
			// define root node.
			this._rootNode = {};
			// draw child item components.
			this.$.treenode.destroyClientControls();
			this.prepareTreeDataSource(this.source, this._rootNode);
			var components = this._rootNode.components;
			this.$.treenode.addNodes(components);
			// record current higlight item.
			// 
			this.highlightNodeItem(this.$.treenode);
		} else {
			this.zLog("current tree menu source is empty!");
		}
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
				hash: node.hash, content: node.content//不能用id属性.因为ENYO 里面组件查找是通过ID 来的容易照成冲突 非常重要。 所以在使用组建的时候一定不能用Id
			};
		};
		var newNode = converter(node);
		// default file icon.
		enyo.mixin(newNode, {
			icon: this.fileIcon,
			onlyIconExpands: this.onlyIconExpands,
			__parent: pNode
		});
		if (newNode.expanded) {
			newNode.icon = this.folderOpenIcon;
			newNode.attributes = {"class":"expanded"};
		}
		if (childs && childs.length) {
			newNode.expandable = true;
			newNode.icon = this.folderIcon;
		}
		if (this.selectedItemValue && newNode[this.selectedItemKey] == this.selectedItemValue) {
			// update the attribute as expanded for all its' parent nodes.
			this._updateParentNodesIfChildSelected(pNode);
			newNode.attributes = {"class":"selected"};
		}
		return newNode;
	},
	//*@ private help method for go through all parent node and udpate it as expanded.
	_updateParentNodesIfChildSelected: function (pNode) {
		pNode.expanded = true;
		pNode.icon = this.folderOpenIcon;
		pNode.attributes = {"class":"expanded"};
		var parentNode = pNode.__parent;
		if (parentNode && parentNode !== this._rootNode) {
			this._updateParentNodesIfChildSelected(parentNode);
		}
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
	highlightNodeItem: function ($node) {
		var $nodes = $node.getControls();
		for (var i = 0; i < $nodes.length; i++) {
			var node = $nodes[i];
			if (node.hasClass("selected")) {
				this.$.selection.select(node.id, node);
				break;
			} else if (node.expanded) {
				this.highlightNodeItem(node);
			}
		};
	},
	nodeTap: function (inSender, inEvent) {
		var node = inEvent.originator; 
		this.$.selection.select(node.id, node);
		this.doItemClick(node);
		return true;
	},
	nodeExpand: function (inSender, inEvent) {
		var isExpanded = inEvent.expanded;
		var $originator = inEvent.originator;
		$originator.addRemoveClass("expanded", isExpanded);
		$originator.setIcon(isExpanded? this.folderOpenIcon: this.folderIcon);
		this.doItemExpandChanged({isExpanded:isExpanded});
		return true;
	}
})