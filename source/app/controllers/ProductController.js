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
	/**
	 * Action method 
	 * @method index corresponding the router config "product/:page"
	 * @param {number} page current page
	 */ 
	index: function (page) {
		var viewData = {page: page};
		this.zLog("action data: ", viewData);
		var viewKindName = "product.Index";
		this.bindingView(viewKindName, null, viewData);
	},	
	/**
	 * Action method 
	 * @method Show corrsponding routerconfig. "product/:page/:id"
	 */
	show: function (page, productId) {
		var viewData = { page: page, productId: productId };
		this.zLog("action data: ", viewData);
		var viewKindName = "product.Show";
		this.bindingView(viewKindName, null, viewData);
	},
	tapTest: function (inSender, inEvent) {
		this.zLog("inSender: ", inSender, "inEvent: ",inEvent);
		// notify view to update ui interface.
		this.set("viewModel", {test:'test product controller sysnc!'});
		return true;
	}
});