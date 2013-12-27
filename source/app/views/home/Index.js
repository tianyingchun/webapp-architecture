/**
 * Master.views.home.Index view.
 * @extends Master.View
 */
enyo.kind({
	name: "Master.views.home.Index",
	kind: "Master.View",
	events:{
		"onTapTest": ""
	},
	components: [
		{ tag: "div", classes: "home-index", components: [
			{ tag: "div", content:"teststtt........home index view"},
			{ kind: "Button", name:"testTap", content:"test Tap", ontap:"testTap"}
		]}
	],
	testTap: function () {
		this.zLog("test tap.....");
		this.doTapTest();
		return true;
	},	
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// this.zLog("home index create: controller", this);
		};
	})
});