/**
 * This is master controller.
 * @class Master.Controller
 * @extends {enyo.ViewController}
 */
enyo.kind({
	name: "Master.Controller",
	kind: "enyo.ViewController",
	mixins:[
		"Master.ClassSupport",
		"Master.HistorySupport"
	],
	//@ *private variable set it on the prototype of the controller, __global__ cache.
	// cause of only in controller instance can be existd in app life cycle.
	// designed used to save all mappings between controller and views.  one controller can be mapped to multi views.
	// and each view can bubble event to controller, and then controller can bubble to view's parent/owner
	_viewMapping: {
		//"Master.views.home.Index": enyo instance(view instance),-> actions: index(), show() in view.
		//"Master.views.shared.leftDock": enyo instance(view instance)-> actions: index(), show() in view.
	},
	/**
	 * Binding relationship between controller and view.
	 * @param  {string} viewName e.g. Master.views.home.Index only need to input "home.Index"
	 * @param  {object} viewData transfer controller data to view, can be model instance, or any objects.
	 * @returns {object} return the current view kinds configuration.
	 */
	bindingView: function (viewName, viewModel, viewData) {
		// this.zLog("viewName:", viewName, "viewModel: ", viewModel, "viewData: ", viewData);
		var kindName = "";
		
		if (!!~viewName.indexOf("Master")) {
			kindName =  viewName;
		} else {
			kindName = "Master.views.".concat(viewName);
		}
		// view kind config.
		var viewKindCfg = {
			name: this.getClass$Name(kindName),
			kind: kindName,
			$$controller: this,
			bubbleTarget: this// set bubble events.
		};
		// extend route data.
		enyo.mixin(viewKindCfg, {
			viewModel: viewModel || null,
			viewData: viewData || null
		});

		return viewKindCfg;
	},
	//@public
	bindingViewToDock: function (viewName, viewModel, viewData) {
		var kindConfig = this.bindingView(viewName, viewModel, viewData);
		Master.view.frame.setDockContent(kindConfig);
	},	
	//@public
	bindingViewToContent: function (viewName, viewModel, viewData) {
		var kindConfig = this.bindingView(viewName, viewModel, viewData);
		Master.view.frame.setMainContent(kindConfig);
	},
	/**
	 * @public
	 * Get view cache key will serve as _viewMapping key.
	 * @param  {string} viewKindName specific view kind name. e.g. Master.views.home.Index
	 */
	getViewCacheKey: function (viewKindName) {
		var kindName = "";
		if (!!~viewKindName.indexOf("Master")) {
			kindName =  viewKindName;
		} else {
			kindName = "Master.views.".concat(viewKindName);
		}
		var viewCacheKey = this.getClass$Name(kindName);
		return "$$_"+viewCacheKey.toLowerCase();
	},
	/**
	 * @public
	 * Cache current view as item mapping for current controller.
	 * @param {string} viewKindName   the view kind name,"Master.views.home.Index" or "home.Index"
	 */
	setViewMapping: function (viewKindName, viewInstance) {
		var cacheKey = this.getViewCacheKey(viewKindName);
		if (viewInstance === null) {
			delete this._viewMapping[cacheKey];
		} else {
			this._viewMapping[cacheKey] = viewInstance;
		}
		this.zLog("viewMapping:", this._viewMapping);
	},
	/**
	 * Notify view to update ui interface.
	 * @public
	 * @param {string} viewKindName required field.
	 * @param {object} viewModel the model data(enyo instance) or any customized object to view.
	 * @param {string} viewData the viewData:{action:showCategoryDetail, data: null}
	 */
	notifyView: function (viewKindName, viewModel, viewData) {
		// this.zLog("viewModel: ", viewModel, "viewData: ", viewData);
		var viewCacheKey = this.getViewCacheKey(viewKindName);
		var view = this._viewMapping[viewCacheKey];
		if (view) {
			// send message to view.
			view.receiveMessage(viewModel, viewData);
		} else {
			this.zError("can't find the view cache instance in controller. pls check if you have binding this view first", viewKindName);
		}
	},
	statics:{
		// provider "constants" property key ability.
		// @protected, used to store all kindName of specific view related of current controlls.
		// the kind name is Uppercase() constants.
		// {PROFILE_CATEGORY_EDIT: "profile.CategoryEdit"}
		subclass: function (ctor, props) {
			var proto = ctor.prototype;
			enyo.mixin(proto, proto.constants);
			delete proto.constants;
		}
	}
});