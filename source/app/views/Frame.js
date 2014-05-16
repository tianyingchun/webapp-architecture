
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
			{ kind:"Master.views.controls.HeaderLink"},
			{ kind:"Master.views.controls.HeaderMenu"}
		]},
		{name:"page", id:"page", components: [
			{name: "main", classes: "page-inner", components: [
				{name:"twoColumnLayout", kind:"widgets.layout.TwoColumnDivision", 
					leftDock: [
						{name:"breadtitle", classes:"bread-title", components: [
							{tag:"h3", content:"文档中心"}
						]}, 
						{name:"coldock",classes:"coldock-inner"}
					], 
					rightContent: [
						{classes:"content-header", components: [
							{name:"siteNav", kind:"Master.views.controls.SiteNavigator"},
							{name:"siteSearch", kind:"Master.views.controls.SiteSearch"}
						]},
						{name:"colWrapper", classes:"col-wrapper", components: [
							{name:"mainContent"}
						]} 
					],
					config: {
						leftDock: "coldock",
						rightContent: "mainContent"
					}
				}
			]}
		]},
		{name:"footer", id:"footer", components: [
			 {kind: "Master.views.controls.FooterLink"}
		]}
	],
	handlers: {
		onContainerRendered: "twoColumnLayoutRenderedHandler",
		onAccordionViewChanged: "accordionViewChangedHandler",
		onViewUpdated: "viewUpdatedHandler"
	},
	// capture render eventfor TwoColumnDivision layout control changed.
	twoColumnLayoutRenderedHandler: function (inSender, inEvent) { 
		this.reflowPageLayout(inEvent.height || 0);	
		return true;
	},
	viewUpdatedHandler: function (inSender, inEvent) {
		this.notifyTwoColumnLayoutReflow();
		return true;
	},
	accordionViewChangedHandler: function(inSender, inEvent) {
		this.notifyTwoColumnLayoutReflow();
		return true;
	},
	//*@public
	notifyTwoColumnLayoutReflow: function (timeout) {
		timeout = timeout || 1;
		var self = this;
		setTimeout(function () {// move exec time to next time slice
			self.$.twoColumnLayout.reflowPageLayout();
		},timeout);
	},
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// do some intialize 
			this.init();
		};
	}),
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// set minimal height for page body.
			this.reflowPageLayout();
		};
	}),
	init: function () {
		// setting current theme class name.
		var themeClass = Master.config.themeClass;
		if (themeClass) {
			this.addClass(themeClass);
		}
		// apply the global classes to frame.
		this.addClass(this.getPlatformType());
		// save current dock categories default config.
		this.__dockCategoriesConfig = { parentId: 0, level: 0 };
	},
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
	reflowPageLayout: function (height) {
		height = height||0;
		var minimalHeight = this.calMinimalPageheight(); 
		var currHeight = Math.max(minimalHeight, height); 
		this.$.page.applyStyle("min-height", currHeight+"px");
		this.$.twoColumnLayout.updateStyles({height:currHeight +"px"});
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
		this.$.twoColumnLayout.setMainContent([viewConfig]);
	},
	setDockContent: function (viewConfig) {
		this.$.twoColumnLayout.setDockContent([viewConfig]);
	},
	setDockContentTitle: function (title) {
		var $control = this.$.twoColumnLayout.findControlByName("contentTitle");
		if($control ){
			$control.setContent(title);
		}
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
		var $dockControls = this.$.twoColumnLayout.getDockControls();
		if ($dockControls.length && $dockControls[0].kindName == "Master.views.shared.DockCategories") {
			return true;
		}
		return false;
	},
	hasProfileContentInDock: function () {
		var $dockControls = this.$.twoColumnLayout.getDockControls();
		if ($dockControls.length && $dockControls[0].kindName == "Master.views.shared.DockProfiles") {
			return true;
		}
		return false;	
	},
	// get all config parameters for current displayed categories menu in left dock.
	getCurrentCategoryDockConfig: function () {
		return this.__dockCategoriesConfig;
	},
	// save lasted loaded dock categories level configurations.
	setCurrentCategoryDockConfig: function (levelConfig) {
		this.__dockCategoriesConfig = levelConfig
		this.zLog("latest level config: ", levelConfig);
	},
	//*@public tree rootnode.
	setSiteNavMapTree: function (tree, force) {
		if (!this.__$siteNav) {
			this.__$siteNav = this.$.twoColumnLayout.findControlByName("siteNav");
		}
		$siteNav = this.__$siteNav;
		if ($siteNav) {
			if ($siteNav.get("treeSource") === null || force){
				$siteNav.set("treeSource", tree);
			}	
		}
	},
	//*@public the leafNode
	setSiteNavLeafNode: function (leafNode) {
		if (!this.__$siteNav) {
			this.__$siteNav = this.$.twoColumnLayout.findControlByName("siteNav");
		}
		$siteNav = this.__$siteNav;

		$siteNav.set("leafNode", leafNode);
	},
	// *@public set search input value.
	setSearchInputTxt: function (searchTxt) {
		var $siteSearch = this.$.twoColumnLayout.findControlByName("siteSearch");
		if ($siteSearch) {
			$siteSearch.setSearchValue(searchTxt);
		}
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