/**
 * This is master view.
 * @class Master.View
 * @extends {enyo.Control}
 */
enyo.kind({
	name: "Master.View",
	kind: "enyo.Control",
	mixins:[
		"Master.ClassSupport"
	],
	/**
	 * basic infrustratures for each view. it will be invoked automatically in controller->action
	 * @param  {object} controller enyo instance.
	 */
	viewInitialize: function (controller) {
		this.controller = controller;
	},
	/**
	 * @override
	 * Destory somethings.
	 */
	destroy: enyo.inherit(function (sup) {
		return function () {
			// destory controller reference.
			this.controller = null;
			sup.apply(this, arguments);
		};
	})
});