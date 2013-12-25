/**
 * Master.views.home.Index view.
 * @extends Master.View
 */
enyo.kind({
	name: "Master.views.home.Index",
	kind: "Master.View",
	components: [
		{ tag: "div", classes: "home-index", components: [
			{ tag: "div", content:"teststtt........home index view"}
		]}
	],
	create: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			this.zLog("home index create: controller", this);
		};
	})
});