enyo.kind({
	name:"Master.views.controls.SiteNavigator",
	classes: "site-navigator",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		treeSource: null,
		leafNode: null	 
	},
	components:[
		{ name:"nav", allowHtml:true, content:""}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
		};
	}),
	leafNodeChanged: function () {
		// make sure the leafnode 
		var leafNode = this.leafNode;
		if (leafNode.id && leafNode.name) {
			this.refreshNav(leafNode);
		}
	},
	refreshNav: function (leafNode) {
		this.zLog("leafNode: ", leafNode);
		if (this.treeSource && enyo.isObject(this.treeSource)) {
			var html = this._generateTreeMap(this.treeSource, leafNode);
			this.$.nav.setContent(html);
		}
	},
	_generateTreeMap: function (treeRoot, treeLeaf) {
		var path = [],findNode = this._findTreeNode(treeRoot, treeLeaf);
		if (findNode) {
			do {
				if (findNode.id != 0) {
					path.push(findNode);
				}
				findNode = findNode.parent;
			} while(findNode != null);
		}
		var navHtml = [],leafNode = path.shift(0);

		for (var i = path.length - 1; i >= 0; i--) {
			var nodeHtml = this._getNodeText(path[i]);
			if (nodeHtml) {
				navHtml.push(nodeHtml);
			}
		};
		leafNode = leafNode || treeLeaf;
		navHtml.push("<span>"+leafNode.name+"</span>");
		return navHtml.join("<i class='icon-angle-right'></i>");
	},
	_getNodeText: function (node) {
		var html = "";
		if (node && enyo.isObject(node)) {
			html = '<a href="#node/'+node.key+'">'+node.name+'</a>';
		}
		return html;
	},
	_findTreeNode: function (treeRoot, treeLeaf) {
		if (treeRoot && treeLeaf) {
			if(treeRoot.id == treeLeaf.id) {
				return treeRoot;
			}
			for (var i = 0; i < treeRoot.children.length; i++) {
				var node = treeRoot.children[i];
				var find = this._findTreeNode(node, treeLeaf);
				if (find) {
					return find;
				}
			};
			return null;
		}
		return null;
	}
});