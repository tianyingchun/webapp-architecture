enyo.kind({
	name:"Master.views.controls.FooterLink",
	classes:"footer-inner", 
	mixins: [
		"Master.ClassSupport"
	],
	components:[
		{ classes:"left-aside", components: [
			{ classes:"aside-link", tag: "ul", components: [
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://www.clothesgate.com/" }, content:"CG 主站(womens)"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://mens.clothesgate.com/" }, content:"CG Mens"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://www.eka.cn/" }, content:"CG Kids"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { href:"mailto:staff.clothesgate@outlook.com" }, content:"Mail Us"}
				]}
			]},
			{classes:"copyright", components:[
				{classes:"text", tag:"span", content:"Copyright © 2014 Clothes Gate. All rights reserved. Powered by clothesgate.com "},
				{name:"admin", action:"LOGIN", classes:"admin icon-user-md",ontap:"loginTap",tag:"i"},
				{name:"logout", classes:"logout",showing:false, ontap:"logoutTap", content:"注销"}
			]}
		]}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.init();
		};
	}),
	init: function () {
		// for now always return true.
		if(true || Master.session.getToken()) {
			this.updateLoginState(true)	;
		}
	},
	updateLoginState: function (loginSuccess) {
		if (loginSuccess) {
			this.$.admin.addClass("has-logined");
			this.$.admin.action = "GO_TO_PROFILE";
			this.$.logout.show();
		} else {
			this.$.logout.hide();
			this.$.admin.action = "LOGIN";
			this.$.admin.removeClass("has-logined");
		}
	},
	loginTap: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		var action = $originator.action;
		switch (action) {
			case "LOGIN":
				var config = {
					authenticateFn: this.bindSafely("authenticating")
				};
				var loginDialog = new widgets.dialog.NormalLoginDialog(config);
				loginDialog.show();
			break;
			case "GO_TO_PROFILE":
				location.href="#profile";
			break;
		}
		return true;
	},
	logoutTap: function (inSender, inEvent) {
		// logout current session.
		Master.session.logout();
		this.updateLoginState(false);
		// redirect to home page
		location.href = "#home";
		return true;
	},
	authenticating: function (user, context) {
		this.zLog("user: ", user, "context:", context);
		var userModel = new Master.models.user.UserModel();
		userModel.login(user, this.bindSafely("loginCallback", context));
	},
	loginCallback: function (context, viewModel) {
		this.zLog("login callback: ", viewModel);
		var loginStatus = viewModel.restInfo;
		if (loginStatus && loginStatus.retCode ==1) {
			var user = {
				username: viewModel.get("username"),
				password: viewModel.get("password"),
				lastActive: enyo.perfNow(),
				role: "admin",
				token: viewModel.get("token")
			}
			// save auth ticket entity.
			Master.session.saveAuthenticateTicket(user);
			// update ui login status. (show logout link)
			this.updateLoginState(true);
			// hdie spinner. then close dialog.
			context.hideSpinner();
			context.closeDialog();
		} else {
			// login failed.
			context.showAuthStatus(loginStatus.retMessage);
			context.hideSpinner();
		}
	}
});