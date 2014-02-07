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
		{name: "spinner",classes:"iframe-spinner", kind:"widgets.base.SpinnerBlock", message:"initializing..."},
		{name:"iframe", showing: false, attributes:{scrolling:"no"}, tag:"iframe", classes:"iframe"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.iframeSrcChanged();
		};
	}),
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			//binding iframe onload events.
			this.bindLoadEvent();
		};
	}),
	//*@ private help method for listener when the iframe page loaded.
	bindLoadEvent: function () {
		var $iframe = this.$.iframe;
		var $spinner = this.$.spinner;
		if ($iframe.hasNode()) {
			var $node = $iframe.node;
			enyo.dispatcher.listen($node, "load", function (e) {
				// show iframe content.
				$iframe.setShowing(true);
				$spinner.setShowing(false);
			});
		}
	},
	titleChanged: function (oldTitle) {
        this.$.headerTitle.setContent(this.title);
    },
    closeDialog: function () {
        this.hide();
        return true;
    },
    show: enyo.inherit(function (sup) {
    	return function () {
    		sup.apply(this, arguments);
    		// while we exec show(), then we will manually invoke spinner reflow()
    		// to reflow spinner layout.
    		this.$.spinner.reflow();
    	};
    }),
	iframeSrcChanged: function () {
		this.$.iframe.setAttribute("src",this.src);
	}
});