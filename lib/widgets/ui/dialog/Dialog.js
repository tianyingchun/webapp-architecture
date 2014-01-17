/*
 * defined dialog box base class, basically won't use this file directly.
 * can be derived Alert, DialogConfirm
 */
enyo.kind({
	name: "widgets.dialog.Dialog",
	kind: "onyx.Popup",
	classes: "widget-dialog",
	scrim: true,
	centered: true,
	floating: true,
	autoDismiss: false,
	allowHtml: true,
	modal: true,
	published: {
		title: "",
		message: "",
		headerComponents:[],
		contentComponents:[],
		footerComponents:[]
	},
	components: [
		{ name: "header", classes:"widget-dialog-header", components: this.headerComponents },
		{ name: "client", classes:"widget-dialog-body", components: this.contentComponents },
		{ name: "footer", classes:"widget-dialog-footer", components: this.footerComponents }
	],
	create: function() {
		this.inherited(arguments);
		// this.titleChanged();
		// this.messageChanged();  
		this.headerComponentsChanged();
		this.contentComponentsChanged();
		this.footerComponentsChanged();
	},
	titleChanged:function (oldTitle) {
		this.$.header.setContent(this.title);
	},
	messageChanged: function(oldMessage) {
		this.$.client.setContent(this.message);
	},
	headerComponentsChanged: function (oldHeaderComponents) {
		this.$.header.destroyClientControls();
		this.$.header.createClientComponents(this.headerComponents);
	},
	contentComponentsChanged: function (oldContentComponents) {
		this.$.client.destroyClientControls();
		this.$.client.createClientComponents(this.contentComponents);
	},
	footerComponentsChanged: function (oldFooterComponents) {
		this.$.footer.destroyClientControls();
		this.$.footer.createClientComponents(this.footerComponents);
	},
	/**
     * allow us customized dialog body content dynamicly.
     */
    getDialogBodyControls: function () {
        return this.$.client;
    },
    getDialogFooterControls: function () {
    	return this.$.footer;
    },
    hide: function () {
    	this.inherited(arguments);
    	// make sure destroy current dialog instance.
    	this.destroy();
    }
});