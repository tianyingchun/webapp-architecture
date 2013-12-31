enyo.kind({
	name: "Master.views.Frame",
	kind: "Master.View",
	layoutKind: "FittableRowsLayout",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", content: "Hello World"},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "main", classes: "nice-padding"}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.Button", content: "Tap me", ontap: "helloWorldTap"}
		]}
	],
	handlers: {
		onGetCategoryDetail: "getCategoryDetail"
	},
	helloWorldTap: function(inSender, inEvent) {
		this.$.main.setContent("The button was tapped.<br/>");
	},
	/**
	 * Set view config as child client control for main frame view.
	 * @param {object} viewConfig  the object that hold all configurations of enyo kind.
	 */
	setMainContent: function (viewConfig) {
		this.zLog("viewConfig: ", viewConfig);
		var $main = this.$.main;
		$main.destroyClientControls();
		$main.createClientComponents([viewConfig]);
		$main.render();
	},
	setDockContent: function (viewConfig) {
		var $dock = this.$.dock;
		// do something..
	},
	getCategoryDetail: function () {
		this.zLog("getCategoryDetail for test.....");
	}
})