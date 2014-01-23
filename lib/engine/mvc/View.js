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
		"Master.ClassSupport",
		"Master.HistorySupport"
	],
	published: {
		viewModel: null,
		// viewData: defined in each view. receiveMessage can know which callback can hold current message.
		// {action: null, data:null}
		// action: the method name in view, the data passed in view.
		viewData: null // {action:null, data:null} the \
	},
	observers:{
		viewDataChanged: ["viewModel"]
	},
	/**
	 * Receive message from corresponding controller.
	 * Note: you can override this function in specific view, but please don't use enyo.inherit().
	 * if you do so, it will invoke view action twice.
	 * @public
	 * @param  {object} viewModel the date sent from controller,
	 * if we set viewModel  is null, simpley notify view to render this action.
	 */
	receiveMessage: function (viewModel, viewData) {
		// this.zLog("received message(viewModel):", viewModel, " ,viewData: ",viewData);
		var restInfo = viewModel && viewModel.restInfo;
		if (restInfo && restInfo.retCode != 1) {
			Master.view.frame.showAlertDialog({
				title: Master.locale.get("DIALOG_ALERT_ERROR", "title"),
				message: restInfo.retMessage
			});
			return;
		}
		var viewAction = viewData && viewData.action;
		var data = viewData && viewData.data;
		// auto match view action handler in current view.
		var viewActionFn = viewAction && this[viewAction];

		if (!viewActionFn) {
			this.zWarn("view action don't exist in View instance!");
		} else {
			viewActionFn.call(this, viewModel, data);
		}
	},
	/**
	 * Change view data and notify observers(view) to update the ui.
	 * Now no nothing for this.
	 * @param  {any} previous data 
	 * @param  {any} current  data
	 * @param  {string} property changed property
	 */
	viewDataChanged: function (previous, current, property) {
		// this.zLog("previous:", previous, "current:", current, "property:", property);
		// var viewData = this.get("viewData");
		// current is viewModel
		// this.notifyView(current, viewData);
	},
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
			// e.g. /controllers/HomeController.js now use $$controller to indicates if is our customized controller.
			var $controller = this.$$controller;
			if ($controller) {
				// FIXME. the controller bubble target alwasy equals Master.view.frame.
				// do we need to specific each bubbleTarget owner for each view.
				// now all childs components will hooked into the Master.view.frame.
				$controller.bubbleTarget = this.getOwner();
				// invoke setObservers for controller.
				$controller.setViewMapping(this.kindName, this);
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
				$controller.setViewMapping(this.kindName,null);
				// clean memory
				this.$$controller = null;
			}
			sup.apply(this, arguments);
		};
	})
});