/**
 * Defined application name is Z
 * In apllication start we will initalized the global unique instance
 * includes "all controllers" "Master.router" "Master.session" "Master.view.frame" 
 * and start router trigger.
 */
enyo.kind({
	name: "Master.Application",
	kind: "enyo.Application",
	view: "Master.views.Frame",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		//{log: 20, warn: 10, error: 0},
		// default log level is 20 enable log,warn,error.
		// in live environment we should set it to <=10
		logLevel: 20
	},
	//@private the global router $ name constants.
	_routerName: "Master.router",
	constructor: enyo.inherit(function (sup) {
		return function () {
			// assign global all controllers,router,... cached into memory.
			this.components = this.getRegisteredControllers();	
			// Assign session model as global singleton ASAP.
			enyo.setPath("Master.session", new Master.models.Session());

			sup.apply(this, arguments);
		}
	}),
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// logLevelChanged
			this.logLevelChanged();
			//append route into global singleton instance after controllers.
			this.createComponent({
				name: this._routerName,
				kind: "Master.Router"
			});
			//application initialization. at this time the view has been instenced.
			this.appInitializatiin();
		};
	}),
	//set log level.
	logLevelChanged: function (oldValue) {
		enyo.setLogLevel(this.logLevel);
	},
	/**
	 * Application start initialization some basic infrastratures.
	 * Note: this.view will be instanced while create lifecycle. need to put it into create().
	 */
	appInitializatiin: function () {
		// Assign master.views.Frame into gloabl singleton.
		enyo.setPath("Master.view.frame", this.view);
		var router = this.$[this._routerName];
		if (router) {
			router.startRoute();
		} else {
			this.zError("can't find Master.router instance in application.js");
		}
	},
	getRegisteredControllers: function () {
		// get default router config.
		var configRoutes = Master.config.routeConfig;
		var controllers = [];
		for (var i = 0; i < configRoutes.length; i++) {
			var route = configRoutes[i];
			var controller = this.getControllerKind(route);
			if (!this._ifControllerKindExist(controllers, controller)) {
				controllers.push(controller);
			}
		};
		return controllers;
	},
	/**
	 * Check current controller kind if exist in application components.
	 * Singleton don't repeated add controller instance into global enyo.application
	 * @private
	 * @param  {object} controllerKind controller information { name:"", kind:""}
	 */
	_ifControllerKindExist: function (components, controllerKind) {
		var exist = false;
		if (controllerKind && enyo.isObject(controllerKind)) {
			for (var i = 0; i < components.length; i++) {
				var controller = components[i];
				if (controller.kind === controllerKind.kind) {
					exist = true;
					break;
				}
			};
		} else {
			this.zLog("Current controller kind has existed!");
		}
		return exist;
	},
	/**
	 * Get controller refs name and controler kind name.
	 * @param  {object} configRoute configurate within configRoute.js
	 * @returns {object} {name: "Master.controller.homecontroller", kind: "Master.controller.HomeController"}
	 */
	getControllerKind: function (configRoute) {
		var kindName = configRoute && configRoute.controller;
		if (kindName) {
			kindName = !!~kindName.indexOf("Controller") ? kindName : kindName + "Controller";
			kindName = ["Master.controllers", kindName].join(".");
			return {
				name: this.getClass$Name(kindName),
				kind: kindName
			};
		} else {
			this.zError("get controller name failed in boot/Application.js!");
			return null;
		}
	}
});