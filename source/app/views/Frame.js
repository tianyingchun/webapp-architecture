
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
						{name:"signin", ontap:"showLoginPopup", tag:"span", classes:"sign-in", content:Master.locale.get("SIGN_IN","menu")},
						{tag: "span",classes:"seperator", content:"/"},						
						{tag:"span", classes:"register",content:Master.locale.get("REGISTER","menu")}
					]}
				]},
				{ classes:"top-nav", tag:"ul", components: [
					{ tag:"li", classes:"nav-item", components: [
						{ tag: "a", attributes: { href:"/" }, content: Master.locale.get("HOME", "nav")}
					]},
					{ tag:"li", classes:"nav-item", components: [
						{ tag: "a", attributes: { target:"_blank", href:"http://www.pingan.com/" }, content: Master.locale.get("OFFICIAL_SITE", "nav")}
					]}
				]},
				// search form
				// {kind: "widgets.forms.SearchForm"}
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
			]}//, disabled api sdk function module now.
			// {name:"apiSdk", classes:"sdk",offsetDistance:500, marginLeft:"81%", kind: "widgets.custom.TabControl"}
		]},
		{name:"footer", id:"footer", components: [
			{classes:"footer-inner", components:[
				{ classes:"left-aside", components: [
					{ classes:"aside-link", tag: "ul", components: [
						{ tag:"li", classes:"link-item", components:[
							{tag:"a", attributes: { target:"_blank", href:"http://www.pingan.com/" }, content:"平安"}
						]},
						{ tag:"li", classes:"link-item", components:[
							{tag:"a", attributes: { target:"_blank", href:"https://www.1qianbao.com/" }, content:"壹钱包"}
						]}
					]},
					{classes:"copyright", content:"Copyright© 2013-2016 壹钱包版权所有"}
				]},
				{ classes: "right-aside", components: [
					{classes:"our-service", components: [
						{classes:"dev-feedback", content:"问题反馈"},					
						// {classes:"dev-mail", content:"dev_support@pingan.com.cn"},
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
		// disabled this function module now.
		// var $sdk = this.$.apiSdk;
		// $sdk.set("itemSource", tabItemsSource);
		// $sdk.show();
	},
	hideSDKPanel: function () {
		// disabled this function module now
		// this.$.apiSdk.hide();
	},	
	showSDKPanel: function () {
		// disabled this function module now
		// this.$.apiSdk.show();
	},
	// go to application home page.
	goHome: function () {
		this.home();
		return true;
	},
	showLoginPopup: function (inSender, inEvent) {
		this.zLog("show login popup");
		inEvent.preventDefault();
		var loginDialog = new widgets.dialog.LoginDialog();
		loginDialog.show();
	},
	/**
	 * Check if current dock cotnains any valid categories contents.
	 * @return {Boolean} [description]
	 */
	hasCategoryContentsIndock: function () {
		var $dock = this.$.coldock;
		var $dockControls = $dock.getControls();
		if ($dockControls.length && $dockControls[0].kindName == "Master.views.shared.DockCategories") {
			return true;
		}
		return false;
	},
	hasProfileContentInDock: function () {
		var $dock = this.$.coldock;
		var $dockControls = $dock.getControls();
		if ($dockControls.length && $dockControls[0].kindName == "Master.views.shared.DockProfiles") {
			return true;
		}
		return false;	
	},
	sdkTransactionStep: function (inSender, inEvent) {
		var fraction = inEvent.fraction;
		var slideshown = inEvent.slideshown;

		// this.zLog("sdk animation params: ", fraction, slideshown);
		return true;
	},
	showNormalDialog: function (title, htmlContent) {
		var normalDialog = new widgets.dialog.NormalDialog();
		normalDialog.setTitle(title);
		normalDialog.setHtmlContent(htmlContent);
		normalDialog.show();
	},
	//@public show spinner dialog message.
	//eg. { message:"", size:30}
	//FIXME. we will consider put the _spinnerDialog implemetation into SpinnerDialog.js
	showSpinnerPopup: function (config) {
		if(!this._spinnerDialog) {
			this._spinnerDialog = new widgets.dialog.SpinnerDialog(config);
		}
		// return current message uid.
		return this._spinnerDialog.show(config.message);
	},
	//* @public
	hideSpinnerPopup: function (uid) {
		if(this._spinnerDialog) {
			// if true has desctoryed this spinner control.
			if(this._spinnerDialog.hide(uid)) {
				this._spinnerDialog = null;
			}
		}
	},
	 /**
     * Show alert dialog box
     * @param {Object} config the alert dialog configurations
     * eg.{
     *      title:'title',
     *      okButtonText: "Yes",
            message: "", 
            success:function(){}
     *    }
     */
	showAlertDialog: function (config) {
		var alertDialog = new widgets.dialog.AlertDialog(config);
        return alertDialog.show();
	}, 
	/**
     * Show confirm dialog 
     * @param {Object} config the confirm dialog configurations
     * eg.{
     *      title:'title',
     *      confirmText: "Yes",
            cancelText: "Cancel",
            message: "", 
            success:function(){},
            failure:function(){}
     *    }
     */
	showConfirmDialog: function (config) {
		var confirmDialog = new widgets.dialog.ConfirmDialog(config);
        confirmDialog.show();
	}
})