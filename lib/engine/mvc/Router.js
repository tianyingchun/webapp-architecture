/**
 * extend exist router
 * @extends { enyo.Router}
 */
enyo.kind({
	name: "Master.Router",
	kind: "enyo.Router",
	// Disabled router start automatically, 
	// because we need to put some initialize logics in Master.session.
	triggerOnStart: false,

	mixins: [
		"Master.ClassSupport",
		"Master.TimeoutSupport"
	],
	constructor: enyo.inherit(function (sup) {
		return function () {
			this.routes = this.routes || this._getRoutes();
			sup.apply(this, arguments);
		};
	}),
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// this.startRoute();
			// now put startRoute into application.js
		};
	}),
	/**
	 * Start Route do some initialized stuff before route hashchange event dispatch.
	 * @return {[type]} [description]
	 */
	startRoute: function () {
		// wait out app initialized and then trigger router hashchange.
		this.timeout = 10 * 1000;
		this.startTimer();
		this.waitAppInitialized();
	},
	/**
	 * Wait application initalized each 50ms
	 * @protected.
	 */
	waitAppInitialized: function () {
		if (Master.session.hasInitialized()) {
			this.endTimer();
			this.triggerRoute();
		} else {
			//this.zLog("wait session initialized...");
			if (!this.failed) {
				var _this = this;
				setTimeout(function () {
					_this.waitAppInitialized();
				}, 200);
			} else {
				this.zError("wait app initialized failed timeout!");
				// start route.
				this.triggerRoute();
			}
		}
	},
	/**
	 * @protected
	 * @method  triggerRoute
	 * Trigger route hashchange event.
	 */
	triggerRoute: function () {
		if (this.defaultPathOnStart) {
			this.trigger({change: true, location: this.get("defaultPath")});
		} else {
			this.trigger();
		}
	},
	/**
	 * get router config information from master.config.			
	 * @protected
	 * @return {array}
	 */
	_getRoutes: function () {
		var routeConfig = Master.config.routeConfig;
		var routes = []; 
		if (routeConfig && enyo.isArray(routeConfig)) {
			for (var i = 0; i < routeConfig.length; i++) {
				var route = routeConfig[i];
				routes.push({
					path: route.path, //   e.g. home/show
					handler: this.findHandler(route), // controller action method.
					context: this.findController(route)
				});
			};
		}
		return routes;
	},
	/**
	 * If we can't find the route hash, directly redirect to  default Hash.
	 * @return {[type]} [description]
	 */
	defaultRouteHandler: function () {
		this.zLog("default route haschanged handler", arguments);
		// do nothing now
		this.location(Master.config.defaultHash);

		return;
	},
	/**
	 * Get router data from current hash
	 * @param  {string} path hash string
	 * @return {object}      the route data of current hash
	 */
	getRouteData: function (path) {

	},
	/**
	 * Find handlers for route
	 * @param  {object} route the current route
	 * @return {string} "Index" / "Show"      the route handler method name for current router config.
	 * e.g. Index, Show of HomeController.
	 * debug.html#home/index  handler name is: HomeController.Index()
	 * route.context = HomeController Instance.
	 */
	findHandler: function (route) {
		if (route && enyo.isObject(route)) {
			var actionVerb = route.action.toLowerCase() || "index";
			// check current action if exists?
			// FIXME
			// this.defaultRouteHandler();
			return actionVerb;
		} else {
			this.zLog(enyo.format("Can't find matched handler for controller '\%'", route.controller));
		}
	},
	/**
	 * Find controller instance we defined in app/controllers.
	 * @param  {string} path the hash string
	 * @return {object}      ENYO controller instance.
	 * e.g. debug.html#home/index  controller: Master.controllers.HomeController
	 * 
	 */	
	findController: function (route) {
		if (route && enyo.isObject(route)) {
			var controler = route.controller;
			var kindName = !!~controler.indexOf("Controller") ? controler : controler + "Controller";		
			var trueControllerName = this.getClass$Name(["Master.controllers", kindName.toLowerCase()].join("."));
			// find controller instance.
			var controllerInstance = this.findControllerFromApplication(trueControllerName);
			return controllerInstance;
		} else {
			this.zError("Can't find the matched controller! route: ", route);
		}
	},
	/**
	 * Find enyo instance from cached in controllers within enyo.application
	 * @param  {string} $controllerName controller search name $[name]
	 */
	findControllerFromApplication: function ($controllerName) {
		// this.zLog("route controller $ name: ", $controllerName);
		var controllerInstance = null;
		var currApp = enyo.applications[Master.config.appName || "z"];
		if (currApp) {
			controllerInstance = currApp.controllers && currApp.controllers[$controllerName];
		} else {
			this.zError("Application instance find failed!")
		}
		return controllerInstance;
	},
	/**
	 * Override enyo.Router._handleDynamic
	 * @override 
	 * @param  {string} path hash string
	 */
	_handleDynamic: function (path) {
		var dynamic = this._dynamicRoutes;
		var regex;
		var route;
		var handler;
		var context;
		var matches;
		var idx = 0;
		var len = dynamic.length;
		for (; idx < len; ++idx) {
			route = dynamic[idx];
			regex = route.regex;
			if ((matches = regex.exec(path))) {
				// we need to strip off the full match so we can
				// use the other matches as parameters
				matches = matches.slice(1);
				handler = route.handler;
				context = route.context;
				return this._execHandler(context, handler, matches, route);
			}
		}
		return false;
	}

});