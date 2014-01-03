enyo.kind({
	name: "widgets.lists.TreeNodes",
	classes:"widget-treenodes",
	mixins: [
		"Master.ClassSupport"
	],
	handlers: {
		onNodeTap: "nodeTap",
		onExpand: "nodeExpand"
	},
	components: [
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{kind: "enyo.Node", content:Master.locale.get("API_CATALOG","title"), components: [
			{classes:"expanded", content: "Bravo", expandable: true, expanded: true, components: [
				{classes:"item", content: "Bravo-Alpha"},
				{classes:"item", content: "Bravo-Bravo"},
				{classes:"item", content: "Bravo-Charlie"}
			]},
			{content: "Charlie", expandable: true, components: [
				{content: "Charlie-Alpha"},
				{content: "Charlie-Bravo"},
				{content: "Charlie-Charlie"}
			]},
			{classes:"expanded",  content: "Delta", expandable: true, expanded: true, components: [
				{content: "Delta-Alpha"},
				{content: "Delta-Bravo"},
				{content: "Delta-Charlie"}
			]},
			{classes:"expanded", content: "Bravo", expandable: true, expanded: true, components: [
				{content: "Bravo-Alpha"},
				{content: "Bravo-Bravo"},
				{content: "Bravo-Charlie"}
			]},
			{content: "Charlie", expandable: true, components: [
				{content: "Charlie-Alpha"},
				{content: "Charlie-Bravo"},
				{content: "Charlie-Charlie"}
			]},
			{classes:"expanded",  content: "Delta", expandable: true, expanded: true, components: [
				{content: "Delta-Alpha"},
				{content: "Delta-Bravo"},
				{content: "Delta-Charlie"}
			]},
			{content: "Epsilon"}
		]}		
	],
	
	select: function(inSender, inEvent) {
		var node = inEvent.data;
		if (node) {
			node.addClass("selected");	
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