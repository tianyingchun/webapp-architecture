enyo.kind({
	name:"Master.views.controls.SiteNavigator",
	classes: "site-navigator",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		treeSource: null,
		treeNode: null	 
	},
	components:[
		{ name:"nav", allowHtml:true, content:""}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
		};
	}),
	refreshNav: function (leafNode) {
		if (this.treeSource && enyo.isObject(this.treeSource)) {
			var html = this._generateTreeMap(this.treeSource, leafNode);
			this.$.nav.setContent(html);
		}
	},
	_generateTreeMap: function (treeRoot, treeLeaf) {
		var path = [];
		var findNode = this._findTreeNode(treeRoot, treeLeaf);
		if (findNode) {
			do {
				path.push(findNode);
				findNode = findNode.parent;
			} while(findNode.parent != treeRoot);
		}
		var navHtml = []; 
		// generate link
		var leafText = path.shift(0) ? path.shift(0).name: "";

		for (var i = path.length - 1; i >= 0; i--) {
			var nodeHtml = this._getNodeText(path[i]);
			if (nodeHtml) {
				navHtml.push();
			}
		};
		navHtml.push(leafText);
		return navHtml.join("");
	},
	_getNodeText: function (node) {
		var html = "";
		if (node && enyo.isObject(node)) {
			html = '<a href="#node/'+node.key+'">'+node.name+'</a>';
		}
		return html;
	},
	_findTreeNode: function (treeRoot, treeLeaf) {
		if (ttreeRoot && treeLeaf) {
			if(treeRoot.id == treeLeaf.id) {
				return treeLeaf;
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