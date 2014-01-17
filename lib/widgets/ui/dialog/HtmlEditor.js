/**
 * Depandancy maritup lib plugin "/lib/markitup/"
 */
enyo.kind({
	name:"widgets.dialog.HtmlEditor",
	kind: "widgets.dialog.Dialog",
	classes:"dialog-htmleditor",
	contentComponents:[
		{name:"markItUp", kind:"Master.TextEditor"}
	],
	mixins:[
		"Master.ClassSupport"
	],
	published:{
		confirmText:"Confirm",
		cancelText: "Cancel",
		htmlContent:"",// the initalized content for texteditor dialog.
		confirmHandler: ""
	},
	footerComponents: [
		{name:"confirm", ontap:"confirmTap", classes:"confirm", kind:"onyx.Button"},
		{name:"cancel", ontap:"cancelTap", classes:"cancel", kind:"onyx.Button"}
	],
	create:enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.confirmTextChanged();
			this.cancelTextChanged();
			this.htmlContentChanged();
		}
	}),
	confirmTextChanged: function () {
		this.$.confirm.setContent(this.confirmText);
	},
	cancelTextChanged: function () {
		this.$.cancel.setContent(this.cancelText);
	},
	htmlContentChanged: function () {
		this.setEditorContent(this.htmlContent);
	},
	show: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// show mark it up.
			this.$.markItUp.markItUp();
		};
	}),
	confirmTap: function (inSender, inEvent) {
		// this.zLog("confirm tap....");
		if (this.confirmHandler) {
			var textEditor  = this.getEditorContent();
			this.confirmHandler(textEditor);
		}
		this.hide();
		return true;
	},
	cancelTap: function (inSender, inEvent) {
		this.hide();
		// this.zLog("cancel tap....");
		return true;
	},
	setEditorContent: function (html) {
		this.$.markItUp.setEditorContent(html);
	},
	getEditorContent: function () {
		return this.$.markItUp.getEditorContent();
	}
});