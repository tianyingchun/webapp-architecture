enyo.kind({
	name: "widgets.base.Spinner",
	classes: "spinner",
	mixins:[
		"Master.ClassSupport"
	],
	published: {
		message: "Loading...",
		// the spinner image size and the color size.
		size: 30
	},
	components: [
		{tag:"i", name:"spinner",classes:"icon-spinner icon-spin icon-2x pull-left"},
		{name:"message", classes: "message"}
	],
 	create: enyo.inherit(function (sup) {
 		return function () {
 			sup.apply(this, arguments);
 			this.messageChanged();
 			this.sizeChanged();
 		};
 	}),
 	sizeChanged: function (oldValue) {
 		var sizeClass = this.getSizeClass(this.size);
 		this.$.spinner.addClass(sizeClass);
 	},
 	messageChanged: function (oldValue) {
 		var sizeClass = this.getSizeClass(this.size);
 		this.$.message.addClass(sizeClass);
 		this.$.message.setContent(this.message);
 	},
 	getSizeClass: function (size) {
 		return "size-"+size;
 	}
});