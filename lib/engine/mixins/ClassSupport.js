/**
 * BaseClass for all customized class in app, dependancy enyo libarary.
 * Provider some overrided methods from enyo constructor.
 * @author tianyingchun@outlook.com
 * 
 */
(function () {
	if (enyo.getPath("Master.ClassSupport")) {
		return;
	}
	// only for native log output. stringify the json object log string
	var _zLog = function (inMethod, inArgs) {
		var console = window.console;
		if (typeof console === "undefined") {
            return;
        }
		var $a = enyo.isArray(inArgs) ? inArgs : enyo.cloneArray(inArgs);
		var logStr = "zLog->: ";

		for (var i = 0; i < $a.length; i++) {
			var argItem = $a[i];
			var seperator = i > 0 ? [" (", i ,"):"].join("") : "";
			if (enyo.isString(argItem)) {
				logStr = logStr.concat(seperator, argItem);
			} else {
				logStr = logStr.concat(seperator, JSON.stringify(argItem));
			}
		};
        var fn = console[inMethod];
		if (fn && fn.apply) {
			// some consoles support 'warn', 'info', and so on
			fn.apply(console, [logStr]);
		} else if (console.log.apply) {
			// some consoles support console.log.apply
			console.log.apply(console, [logStr]);
		} else {
			// otherwise, do our own formatting
			console.log(logStr);
		}
	};
	/**
	 * Convert current method log parameters.
	 * @param  {object} arguments function primitive arguments object.
	 * @return {array}            the log information array.
	 */
	var	_getLogArgs = function (arguments) {
		var acc = arguments.callee.caller;
		var nom = ((acc ? acc.displayName : "") || "(instance method)") + ":";
		var args = [nom].concat(enyo.cloneArray(arguments));
		return args;
	}
	enyo.setPath("Master.ClassSupport", {
		name: "Master.ClassSupport",
		/**
		 * Get class name that will be referenced/searched by $[name].
		 * e.g. controller: Master.controllers.HomeController --> the class name is
		 * Master.controllers.homecontroller.
		 * @public
		 */
		getClass$Name: function (kindName) {
			var ns = kindName.split(".");
				ns.push(ns.pop().toLowerCase());
			var $className = ns.join(".");
			// this.zLog("$className: ", $className);
			return $className;
		},
		// simple check current device is pc broswer or native broswer or webview.
		isNative: function () {
			//enyo.dom.transition = (enyo.platform.ios || enyo.platform.android || enyo.platform.chrome || enyo.platform.androidChrome || enyo.platform.safari) 
			//enyo.platform.firefox || enyo.platform.firefoxOS || enyo.platform.androidFirefox
			return (enyo.platform.ios || enyo.platform.android);
		},
		zLog: function () {
			var args = _getLogArgs(arguments);
			if (this.isNative()) {
				if (enyo.logging.shouldLog("log")) {
					// do customized log stuff here.
					_zLog("log", args);
				}
			} else {
				this.log.apply(this, args);
			}
		},
		zError: function () {
			var args = _getLogArgs(arguments);
			if (this.isNative()) {
				if (enyo.logging.shouldLog("error")) {
					// do customized error log stuff here.
					_zLog("error", args);
				}
			} else {
				this.error.apply(this, args);
			}
		},
		zWarn: function () {
			var args = _getLogArgs(arguments);
			if (this.isNative()) {
				if (enyo.logging.shouldLog("warn")) {
					// do customized warn log stuff here.
					_zLog("warn", args);
				}
			} else {
				this.warn.apply(this, args);
			}
		}
	});
})();
