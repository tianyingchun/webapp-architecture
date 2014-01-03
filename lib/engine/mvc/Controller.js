/**
 * This is master controller.
 * @class Master.Controller
 * @extends {enyo.ViewController}
 */
enyo.kind({
	name: "Master.Controller",
	kind: "enyo.ViewController",
	mixins:[
		"Master.ClassSupport"
	],
	published:{
		viewModel: null,
		// viewAction: defined in each view. receiveMessage can know which callback can hold current message.
		viewAction: null
	},
	observers:{
		viewDataChanged: ["viewModel"]
	},
	/**
	 * Binding relationship between controller and view.
	 * @param  {string} viewName e.g. Master.views.home.Index only need to input "home.Index"
	 * @param  {object} viewData transfer controller data to view, can be model instance, or any objects.
	 * @returns {object} return the current view kinds configuration.
	 */
	bindingView: function (viewName, viewModel, routeData) {
		this.zLog("viewName:", viewName, "viewModel: ", viewModel, "routeData: ", routeData);
		var kindName = "";
		if (!!~viewName.indexOf("Master")) {
			kindName =  viewName;
		} else {
			kindName = "Master.views.".concat(viewName);
		}
		// view kind config.
		var viewKindConfig = {
			name: this.getClass$Name(kindName),
			kind: kindName,
			$$controller: this,
			bubbleTarget: this// set bubble events.
		};
		// convert parameter.
		var extendData = {
			viewModel: viewModel || null,
			viewData: routeData || null
		};
		// extend route data.
		enyo.mixin(viewKindConfig, extendData);

		return viewKindConfig;
	},
	/**
	 * Change view data and notify observers(view) to update the ui.
	 * @param  {any} previous data 
	 * @param  {any} current  data
	 * @param  {string} property changed property
	 */
	viewDataChanged: function (previous, current, property) {
		this.zLog("previous:", previous, "current:", current, "property:", property);
		// current is viewModel
		this.notifyView(current);
	},
	/**
	 * Notify view to update ui interface.
	 * @public
	 * @param  {object} viewModel the model data(enyo instance) or any customized object to view.
	 */
	notifyView: function (viewModel) {
		var viewAction = this.get("viewAction");
		this.zLog("viewModel: ", viewModel, "viewAction: ", viewAction);
		if (this.view) {
			// send message to view.
			this.view.receiveMessage(viewModel,viewAction);
		}
	}
});