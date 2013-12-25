/**
 * This is master view.  because in order to we can clearly indentify current event which comes from 
 * wich view maybe we need to use bubble event custom event declaration.
 * events: {
	"onViewProductDetail": "", // deal with product detail request in ProductController
	"onViewProductReviews": "" // deal with product reviews request in ProductController.  
	// or the same event with differncet customized event parameters.
 }
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
	 * Get corresponding controller referennce.
	 * @public
	 * @return {object} controller instance.
	 */
	getController: function () {
		return this.$$controller;
	},
	/**
	 * Below is basic View controller relationship, be carefull modify it 
	 */
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			// set current controller parent bubble target is view.owner
			// we must make sure that bubbleTarget config only for our costomized controllers
			// e.g. /controllers/HomeController.js
			var $controller = this.$$controller;
			if ($controller) {
				$controller.bubbleTarget = this.getOwner();
			}
		};
	}),	
	/**
	 * @override
	 * Destory somethings.
	 */
	destroy: enyo.inherit(function (sup) {
		return function () {
			// destory controller reference.
			var $controller = this.$$controller;
			if ($controller) {
				$controller.bubbleTarget = null;
				// clean memory
				this.$$controller = null;
			}
			sup.apply(this, arguments);
		};
	})
});