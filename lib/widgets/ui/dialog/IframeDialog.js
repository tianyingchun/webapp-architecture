enyo.kind({
	name:"widgets.dialog.IframeDialog",
	kind: "widgets.dialog.Dialog",
	classes:"dialog-iframe",
	mixins:[
		"Master.ClassSupport"
	],
	published: {
		iframeSrc: ""
	},
	headerComponents: [
        {name:"headerTitle", classes:"header-title"},
        {name:"close", tag:"button", classes:"close", ontap:"closeDialog", content:"×"}
    ],
	contentComponents:[
		{name:"iframe", attributes:{scrolling:"no"}, tag:"iframe", classes:"iframe"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.iframeSrcChanged();
		};
	}),
	titleChanged: function (oldTitle) {
        this.$.headerTitle.setContent(this.title);
    },
    closeDialog: function () {
        this.hide();
        return true;
    },
	iframeSrcChanged: function () {
		this.$.iframe.setAttribute("src",this.src);
	}
});