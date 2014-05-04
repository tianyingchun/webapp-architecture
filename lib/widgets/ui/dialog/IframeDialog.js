enyo.kind({
	name:"widgets.dialog.IframeDialog",
	kind: "widgets.dialog.Dialog",
	classes:"dialog-iframe",
	mixins:[
		"Master.ClassSupport"
	],
	published: {
		iframeSrc: "",
		postMessageFn: enyo.nop
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
			// receive message.
			this._postMessageScopeFn = this.bindSafely("postMessageFn");
			enyo.dispatcher.listen(window, "message", this._postMessageScopeFn);

			this.iframeSrcChanged();
		};
	}),
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);

			//binding iframe onload events.
			this.bindHtmlEvent();
		};
	}), 
	//*@ private help method for listener when the iframe page loaded.
	// listen receive post message .
	bindHtmlEvent: function () {
		var $iframe = this.$.iframe;
		var $spinner = this.$.spinner;
		if ($iframe.hasNode()) {
			var $node = $iframe.node;
			this._iframeLoadedScopeFn = this.bindSafely("iframeLoaded");
			enyo.dispatcher.listen($node, "load", this._iframeLoadedScopeFn);
		}
	},
	iframeLoaded: function (e) {
		this.$.iframe.setShowing(true);
		this.$.spinner.setShowing(false);
	},
	titleChanged: function (oldTitle) {
        this.$.headerTitle.setContent(this.title);
    },
    closeDialog: function () {
    	// destroy listening message 
    	enyo.dispatcher.stopListening(window, "message", this._postMessageScopeFn);
    	// desctroy listening onload.
    	enyo.dispatcher.stopListening(this.$.iframe.node, "load", this._iframeLoadedScopeFn);
    
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
		this.$.iframe.setAttribute("src",this.iframeSrc);
	},
	showingChanged: enyo.inherit(function (sup) {
        return function () {
            sup.apply(this, arguments);
            this.reflowDialogUI();
        };
    }),
    reflowDialogUI: function () {
        this.applyStyle("margin-left", -(this.getBounds().width/2)+"px");
        this.applyStyle("margin-top", -(this.getBounds().height/2)+"px");
    }
});