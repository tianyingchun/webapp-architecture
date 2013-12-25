/**
 * controllers namespace start Master.controllers.xxxController
 * directory structure related path view app.controllers.
 */
enyo.kind({
	name: "Master.controllers.ProductController",
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
	 * @method Index it alwasy be invoked by route handler
	 */ 
	index: function () {
		this.zLog("params: ", arguments);
	},	
	/**
	 * Action method 
	 * @method Show
	 */
	show: function () {
		this.zLog("params: ", arguments);
	},
	tapTest: function (inSender, inEvent) {
		this.zLog("inSender: ", inSender, "inEvent: ",inEvent);
	}
});