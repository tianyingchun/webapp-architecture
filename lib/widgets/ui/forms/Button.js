/**
 * Bootstrap theme buttin encapsulate.
 * @type {String}
 */
enyo.kind({
	name: "widgets.forms.Button",
	classes:"widgets-form-button",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		themeClasses:"btn btn-danger btn-small",
		text: "Button",
		iconClasses: "icon-trash",
		action:"delete"
	},
	events: {
		onFormButtonTap:""
	},
	handlers: {
		ontap:"tap"
	},
	components: [
		{name:"outer",tag:"a", classes:this.themeClasses, components: [
			{name:"icon", classes:this.iconClasses, tag:"i"},
			{name:"iconTxt", tag:"span"}
		]}
	],
	create:enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.$.outer.addClass(this.themeClasses);
			this.$.icon.addClass(this.iconClasses);
			this.$.iconTxt.setContent(this.text);
		}
	}),
	tap: function (inSender, inEvent) {
		this.doFormButtonTap({action:this.action});
		return true;
	}
});