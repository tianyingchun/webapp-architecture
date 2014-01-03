/**
 * Master.views.home.Index view.
 * @extends Master.View
 */
enyo.kind({
	name: "Master.views.home.Index",
	kind: "Master.View",
	events:{
		"onGetAllCategories": "",
		"onGetCategoryDetail": ""
	},
	components: [
		{kind: "Selection", onSelect: "select", onDeselect: "deselect"},	
		{kind: "Node", icon: "assets/folder-open.png", content: "Tree", expandable: false, expanded: true, onExpand: "nodeExpand", onNodeTap: "nodeTap", components: [
			{icon: "assets/file.png", content: "Alpha"},
			{icon: "assets/folder-open.png", content: "Bravo", expandable: true, expanded: true, components: [
				{icon: "assets/file.png", content: "Bravo-Alpha"},
				{icon: "assets/file.png", content: "Bravo-Bravo"},
				{icon: "assets/file.png", content: "Bravo-Charlie"}
			]},
			{icon: "assets/folder.png", content: "Charlie", expandable: true, components: [
				{icon: "assets/file.png", content: "Charlie-Alpha"},
				{icon: "assets/file.png", content: "Charlie-Bravo"},
				{icon: "assets/file.png", content: "Charlie-Charlie"}
			]},
			{icon: "assets/folder-open.png", content: "Delta", expandable: true, expanded: true, components: [
				{icon: "assets/file.png", content: "Delta-Alpha"},
				{icon: "assets/file.png", content: "Delta-Bravo"},
				{icon: "assets/file.png", content: "Delta-Charlie"}
			]},
			{icon: "assets/folder-open.png", content: "Bravo", expandable: true, expanded: true, components: [
				{icon: "assets/file.png", content: "Bravo-Alpha"},
				{icon: "assets/file.png", content: "Bravo-Bravo"},
				{icon: "assets/file.png", content: "Bravo-Charlie"}
			]},
			{icon: "assets/folder.png", content: "Charlie", expandable: true, components: [
				{icon: "assets/file.png", content: "Charlie-Alpha"},
				{icon: "assets/file.png", content: "Charlie-Bravo"},
				{icon: "assets/file.png", content: "Charlie-Charlie"}
			]},
			{icon: "assets/folder-open.png", content: "Delta", expandable: true, expanded: true, components: [
				{icon: "assets/file.png", content: "Delta-Alpha"},
				{icon: "assets/file.png", content: "Delta-Bravo"},
				{icon: "assets/file.png", content: "Delta-Charlie"}
			]},
			{icon: "assets/file.png", content: "Epsilon"}
		]}
	],
	receiveMessage: function (viewModel, viewAction) {
		var restInfo = viewModel.restInfo;
		if (restInfo.retCode ==1) {
			// do nothing now..
			var viewActionFn = viewAction && this[viewAction];
			if (viewActionFn) {
				viewActionFn.call(this, viewModel);
			}
		} else {	
			alert(restInfo.retMessage);
		}
	},

	nodeExpand: function(inSender, inEvent) {
		inSender.setIcon("assets/" + (inSender.expanded ? "folder-open.png" : "folder.png"));
	},
	nodeTap: function(inSender, inEvent) {
		var node = inEvent.originator;
		this.$.selection.select(node.id, node);
	},
	select: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", "lightblue");
	},
	deselect: function(inSender, inEvent) {
		inEvent.data.$.caption.applyStyle("background-color", null);
	},



	// Get all categories from controller.
	getAllCategories: function (inSender, inEvent) {
		this.zLog("dispatch get all categories event to controller...");
		this.doGetAllCategories({viewAction:"showCategories"});
		return true;
	},
	// show categories.
	showCategories: function (viewModel) {
		this.zLog("show categories view model: ", viewModel);
	},
	// Get category detail.	
	getCategoryDetail: function (inSender, inEvent) {
		this.zLog("dispatch get category detail event to controller...");
		this.doGetCategoryDetail({categoryId: 1});
		return true;
	},

	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// this.zLog("home index create: controller", this);
		};
	})
});