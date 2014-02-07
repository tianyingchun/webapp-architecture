/**
 * Fashion spinner block can be used to any enyo components.
 * it use html5 animation effect for show spinner, and it very differenct from spinnerdialog widget
 * it only can be serve as one static spinner content and nasted in control.
 */
enyo.kind({
	name: "widgets.base.SpinnerBlock",
	classes: "spinner-block layer",
	mixins:[
		"Master.ClassSupport"
	],
	published: {
		message: "Loading..."
	},
	components: [
		{name: "wrapper", classes:"wrapper", components: [
			{name: "loadingWrapper", classes:"loading-wrapper", components: [
				{name: "loading", classes:"loading", components: [
					{name:"spinnerAnimate", classes:"spinner-animation"},
					{name:"spinnerLogo", classes:"spinner-logo"}
				]},
				{name:"message", classes:"message", content:this.message}
			]}
		]}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.messageChanged();
		};
	}),
	messageChanged: function (oldMessage) {
		this.$.message.setContent(this.message);
	},
	reflow: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.adjustPosition();
		};
	}),
	adjustPosition: function () {
		var bounds = this.getBounds();
        var halfWidth = bounds.width;
        var halfHeight = bounds.height;
        this.applyStyle("margin-left", - (halfWidth / 2)+"px");
        this.applyStyle("margin-top", - (halfHeight / 2)+"px");
	}
});