/**
 * Master.views.product.Show view.
 * @extends Master.View
 */
enyo.kind({
	name: "Master.views.product.Show",
	kind: "Master.View",
	events:{
		"onTapTest": ""
	},
	components: [
		{ tag: "div", classes: "home-index", components: [
			{ tag: "div", content:"teststtt........product show view"},
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