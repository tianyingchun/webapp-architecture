
/**
 * Now for the ui layout we support pc broswer. if use mobile maybe need to re-fined or re-define the layout
 *
 **/
enyo.kind({
	name: "Master.views.Frame",
	kind: "Master.View",
	classes:"frame",
	components:[
		{name:"header", id:"header", components: [
			{ classes: "header-inner", components: [
				{ classes:"logo", content: Master.locale.get("LOGO_TEXT","title"), ontap:"goHome" },
				{ classes: "menu", components:[
					{ classes:"item", components:[
						{tag:"a", classes:"sign-in", attributes: { href:"/" }, content:Master.locale.get("SIGN_IN","menu")},
						{tag: "span",classes:"seperator", content:"/"},						
						{tag:"a", classes:"register", attributes: { href:"/" }, content:Master.locale.get("REGISTER","menu")}
					]}
				]},
				{ classes:"top-nav", tag:"ul", components: [
					{ tag:"li", classes:"nav-item", components: [
						{ tag: "a", attributes: { href:"/" }, content: Master.locale.get("HOME", "nav")}
					]},
					{ tag:"li", classes:"nav-item", components: [
						{ tag: "a", attributes: { href:"/" }, content: Master.locale.get("OFFICIAL_SITE", "nav")}
					]}
				]},
				// search form
				{kind: "widgets.forms.SearchForm"}
			]}
		]},
		{name:"page", id:"page", components: [
			{name: "main", classes: "page-inner", components: [
				{name:"coldock", classes:"col-dock"},
				{name:"colmain", classes:"col-main", components: [
					{name:"colWrapper", classes:"col-wrapper", components: [
						{name:"apiDetails"}
					]}
				]}
			]},
			{name:"apiSdk", classes:"sdk",offsetDistance:400, marginLeft:"81%", kind: "widgets.custom.TabControl"}
		]},
		{name:"footer", id:"footer", components: [
			{classes:"footer-inner", components:[
				{ classes:"left-aside", components: [
					{ classes:"aside-link", tag: "ul", components: [
						{ tag:"li", classes:"link-item", components:[
							{tag:"a", attributes: { href:"/" }, content:"平安"}
						]},
						{ tag:"li", classes:"link-item", components:[
							{tag:"a", attributes: { href:"/" }, content:"开发者"}
						]},
						{ tag:"li", classes:"link-item", components:[
							{tag:"a", attributes: { href:"/" }, content:"1钱包"}
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
		]}
	],
	handlers: {
		onGetAllCategories: "getAllCategoriesTest",
		onTransitionStep: "sdkTransactionStep"
	},
	getAllCategoriesTest: function (inSender, inEvent) {
		this.zLog("get all categories testing...", inEvent);
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
			sup.apply(this, arguments);
			// last resize event.
			// do our stuff here while resize window.
			enyo.job("reflowPageLayout", this.bindSafely("reflowPageLayout"),500);
		};
	}),
	// fresh the page body container layout
	reflowPageLayout: function () {
		var minimalHeight = this.calMinimalPageheight();
		// var pageBodyHeight = this.$.page.getBounds().height;
		var dockHeight = this.$.coldock.getBounds().height;
		var dockContent = this.$.colmain.getBounds().height;
		// this.zError(pageBodyHeight,dockHeight,dockContent);
		var currHeight = Math.max(minimalHeight/*, pageBodyHeight*/, dockHeight, dockContent); 
		this.$.page.applyStyle("min-height", currHeight+"px");
	    this.$.coldock.applyStyle("min-height", currHeight +"px");
	},
	//For pc browser model we calculate the minimal height. 
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
	 * @returns {object} the viewConfig enyo instance.
	 */
	setMainContent: function (viewConfig) {
		this.zLog("viewConfig: ", viewConfig);
		var $main = this.$.apiDetails;
		$main.destroyClientControls();
		$main.createClientComponents([viewConfig]);
		$main.render();
	},
	setDockContent: function (viewConfig) {
		var $dock = this.$.coldock;
		$dock.destroyClientControls();
		$dock.createClientComponents([viewConfig]);
		$dock.render();
	},
	// set sdk content for header, tab contents.
	setSDKContent: function (tabItemsSource) {
		var $sdk = this.$.apiSdk;
		$sdk.set("itemSource", tabItemsSource);
	},
	// go to application home page.
	goHome: function () {
		this.home();
		return true;
	},
	/**
	 * Check if current dock cotnains any valid contents.
	 * @return {Boolean} [description]
	 */
	hasContentsIndock: function () {
		var $dock = this.$.coldock;
		var $dockControls = $dock.getControls();
		return $dockControls.length;
	},
	sdkTransactionStep: function (inSender, inEvent) {
		var fraction = inEvent.fraction;
		var slideshown = inEvent.slideshown;

		// this.zLog("sdk animation params: ", fraction, slideshown);
		return true;
	}
})