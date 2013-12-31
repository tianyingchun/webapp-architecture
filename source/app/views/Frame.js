enyo.kind({
	name: "Master.views.Frame",
	kind: "Master.View",
	layoutKind: "FittableRowsLayout",
	fit: true,
	components:[
		{kind: "onyx.Toolbar", id:"header", components: [
			{ classes:"logo", content:"开发者平台", ontap:"goHome" },
			{ classes:"top-nav", tag:"ul", components: [
				{tag:"li", classes:"nav-item", content:"首页"},
				{tag:"li", classes:"nav-item", content:"平安官网"}
			]}
		]},
		{kind: "enyo.Scroller", fit: true, components: [
			{name: "main", classes: "nice-padding"}
		]},
		{kind: "onyx.Toolbar", id:"footer", components: [
			{ classes:"left-aside", components: [
				{ classes:"aside-link", tag: "ul", components: [
					{ tag:"li", classes:"link-item", components:[
						{tag:"a", href:"#", content:"平安"}
					]},
					{ tag:"li", classes:"link-item", components:[
						{tag:"a", href:"#", content:"开发者"}
					]},
					{ tag:"li", classes:"link-item", components:[
						{tag:"a", href:"#", content:"1钱包"}
					]}
				]},
				{classes:"copyright", content:"© 2013 pingan 使用前必读 | 京ICP证030173号"}
			]},
			{ classes: "right-aside", components: [
				{classes:"our-service", components: [
					{classes:"dev-feedback", content:"问题反馈"},					
					{classes:"dev-mail", content:"dev_support@pingan.com.cn"},
					{classes:"dev-center", content:"开发者中心"}
				]}
			]}
		]}
	],
	handlers: {
		onGetCategoryDetail: "getCategoryDetail"
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