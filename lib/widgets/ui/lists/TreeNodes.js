enyo.kind({
	name: "widgets.lists.TreeNodes",
	classes:"widget-treenodes",
	mixins: [
		"Master.ClassSupport",
		"Master.HistorySupport"
	],
	published: {
		source: []
	},
	handlers: {
		onNodeTap: "nodeTap",
		onExpand: "nodeExpand"
	},
	components: [
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"}	
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			var components = [];
			this.constructComponents(this.source, components, 0);
			this.zLog(components);
			this.createComponent([{ kind: "enyo.Node", name:"treenode", content:Master.locale.get("API_CATALOG","title"),components: components }]);
			this.render();
		};	
	}),
	// private help method for convert categories datasource.
	constructComponents: function (source, target, level) {
		target = target || [];
		if (enyo.isArray(source)) {
			for (var i = 0; i < source.length; i++) {
				var item = source[i];
				var convertItem = {
					content: item.categoryName,
					expanded: item.expanded,
					expandable: true,
					key: item.categoryKey,
					level: level
				};
				if (level == 1) {
					convertItem.classes = "item";
				}
				target.push(convertItem);
				var childs = item.childs;
				var hasChilds = childs && childs.length;
				if(hasChilds) {
					convertItem.classes = "expanded";
					convertItem.components = [];
					this.constructComponents(childs, convertItem.components, ++convertItem.level);
				}
				// root level and without childs, we will add noexpand classes.
				if(!hasChilds && level ==0){
					convertItem.classes = "noexpand";
				}
			};
		}
	},
	select: function(inSender, inEvent) {
		var node = inEvent.data;
		if (node) {
			node.addClass("selected");	
			var key = node.key;
			// get storage key from storage store.
			var language = this.getUserApiLanguage();
			var loc = "node/"+key
			if(language) {
				loc = loc +"/"+language;
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