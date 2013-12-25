/**
 * controllers namespace start Master.controllers.xxxController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.HomeController",
	kind: "Master.Controller",
	handlers: {
		onTapTest: "tapTest"
	},
	/*create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.zLog("initialize...");
		};
	}),*/
	/**
	 * Action method
	 * @method 
	 */
	index: function () {
		this.zLog("params: ",this.view, arguments);
		var viewKindName = "home.Index";
		return this.bindingView(viewKindName, {});
	},
	show: function () {
		this.zLog("params: ", arguments);
	},
	tapTest: function (inSender, inEvent) {
		this.zLog("inSender: ", inSender, "inEvent: ",inEvent);
	}
});