enyo.kind({
	name: "widgets.lists.TreeNodes",
	classes:"widget-treenodes",
	mixins: [
		"Master.ClassSupport",
		"Master.HistorySupport"
	],
	published: {
		source: [],
		rootNodeText: Master.locale.get("API_CATALOG","title"),
		selectedKey: "",
		// item converter if exist.
		itemConverter: null
	},
	handlers: {
		onNodeTap: "nodeTap",
		onExpand: "nodeExpand",
		onItemSelected:"nodeSelectedChanged"
	},
	components: [
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"}	
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			var components = [];
			this.constructComponents(this.source, components, 0);
			// this.zLog(components);
			this.createComponent([{ kind: "enyo.Node", name:"treenode", content:this.rootNodeText,components: components }]);
			this.render();
		};	
	}),
	// private help method for convert categories datasource.
	constructComponents: function (source, target, level, parent) {
		target = target || [];
		if (enyo.isArray(source)) {
			for (var i = 0; i < source.length; i++) {
				var item = source[i];
				var convertItem = {
					content: item.categoryName,
					expanded: item.expanded,
					expandable: true,
					isCategoryNode: item.isCategoryNode,
					hashLoc: null,// we can specific hash url "profilemanager/list"
					key: item.categoryKey
				};
				// if we specific item converter it will 
				if (this.itemConverter && enyo.isFunction(this.itemConverter)) {
					convertItem = this.itemConverter(item) || convertItem;
				}
				convertItem.level = level;
				if (this.selectedKey == convertItem.key) {
					convertItem.selected = true;
					// this.constructClasses(convertItem, "selected");
					// force expanded.
					if (parent) {
						parent.expanded = true;
					}
				}
				if (level == 1) {
					this.constructClasses(convertItem, "item");
				}
				target.push(convertItem);
				var childs = item.childs;
				var hasChilds = childs && childs.length;
				if(hasChilds) {
					this.constructClasses(convertItem, "expanded");
					convertItem.components = [];
					this.constructComponents(childs, convertItem.components, ++convertItem.level, convertItem);
				}
				// root level and without childs, we will add noexpand classes.
				if(!hasChilds && level ==0){
					this.constructClasses(convertItem, "noexpand");
				}
			};
		}
	},
	constructClasses: function (item, classes) {
		if(item.classes) {
			item.classes = item.classes.concat(" ", classes);
		} else {
			item.classes = classes;
		}
	},
	nodeSelectedChanged: function(inSender, inEvent) {
		if(inEvent.selected) {
			var node = inEvent.originator;
			this.$.selection.select(node.id, node);
		}
	},
	select: function(inSender, inEvent) {
		var node = inEvent.data;
		if (node) {
			node.addClass("selected");	
			var loc = "";
			if (node.hashLoc) {
				loc = node.hashLoc;
			} else {
				var key = node.key;
				// get storage key from storage store.
				var language = this.getUserApiLanguage();
				var loc = "node/"+key;
				if (node.isCategoryNode) {
					loc = "c/"+key;
				} else {
					if(language) {
						loc = loc +"/"+language;
					}
				}
			}
			this.location(loc);
		}
		// this.zLog("inEvent", inEvent);
	},
	deselect: function(inSender, inEvent) {
		// this.zLog("inEvent", inEvent);
		var node = inEvent.data;
		if (node) {
			node.removeClass("selected");
		}
	},
	nodeTap: function (inSender, inEvent) {
		var node = inEvent.originator;
		// this.zLog(node.id, node);
		this.$.selection.select(node.id, node);
	},
	nodeExpand: function (inSender, inEvent) {
		// var node = inEvent.originator;
		var isExpanded = inSender.expanded;
		inSender.addRemoveClass("expanded", isExpanded);
	}
});