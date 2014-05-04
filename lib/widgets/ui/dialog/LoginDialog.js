/**
 * Designed to integrated 1qianbao oauth login
 * it will abstract for Master.session and user status.
 */
enyo.kind({
	name: "widgets.dialog.LoginDialog",
	kind: "widgets.dialog.IframeDialog",
	classes: "login-dialog",
	title: "用户登陆",
	constructed: enyo.inherit(function (sup) {
		return function () {
			this.iframeSrc = utility.getOauthLoginUrl();
			sup.apply(this, arguments);
		};
	}),
	postMessageFn: function (e) {
		var data = e.data;
		this.zLog("post message received:", data);
		// do some authenticating....
		// then close this dialog.
		setTimeout(this.bindSafely("closeDialog"), 4000);
	},
	authenticate: function (token) {
		//
	}	
});

