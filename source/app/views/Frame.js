
/**
 * Now for the ui layout we support pc broswer. if use mobile maybe need to re-fined or re-define the layout
 *
 **/
enyo.kind({
	name: "Master.views.Frame",
	kind: "Master.View",
	classes:"frame",
	components:[
		{kind: "onyx.Toolbar", name:"header", id:"header", components: [
			{ classes: "header-inner", components: [
				{ classes:"logo", content: Master.locale.get("LOGO_TEXT","title"), ontap:"goHome" },
				{ classes:"top-nav", tag:"ul", components: [
					{ tag:"li", classes:"nav-item", components: [
						{ tag: "a", href:"/", content: Master.locale.get("HOME", "nav")}
					]},
					{ tag:"li", classes:"nav-item", components: [
						{ tag: "a", href:"/", content: Master.locale.get("OFFICIAL_SITE", "nav")}
					]}
				]},
				// search form
				{kind: "widgets.forms.SearchForm"}
			]}
		]},
		{kind: "enyo.Scroller", name:"page", id:"page", components: [
			{name: "main", classes: "page-inner"}
		]},
		{kind: "onyx.Toolbar", name:"footer", id:"footer", components: [
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
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// apply the global classes to frame.
			this.addClass(this.getPlatformType());
		};
	}),
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// set minimal height for page body.
			this.reflowPageLayout();
		};
	}),
	// override reflow workflow.
	reflow: enyo.inherit(function (sup){
		return function () {
			// do our stuff here while resize window.
			// last resize event.
			enyo.job("reflowPageLayout", this.bindSafely("reflowPageLayout"),300);
			sup.apply(this, arguments);
		};
	}),
	// fresh the page body container layout
	reflowPageLayout: function () {
		var minimalHeight = this.calMinimalPageheight();
		minimalHeight = minimalHeight < 200 ? 200 : minimalHeight; 
		this.$.page.applyStyle("min-height", minimalHeight+"px");
	},
	/**
	 * For pc browser model we calculate the minimal height.
	 */
	calMinimalPageheight: function () {
		// window height.
		var wheight = enyo.dom.getWindowHeight();
		var headerHeight = this.$.header.getBounds().height;
		var footerHeight = this.$.footer.getBounds().height;		
		var minimalHeight = wheight - headerHeight - footerHeight;
		return minimalHeight;
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