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
					{tag:"a", attributes: { target:"_blank", href:"http://www.pingan.com/" }, content:"中国平安官网"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"https://www.1qianbao.com/" }, content:"壹钱包"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://one.pingan.com/" }, content:"一账通"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://www.eka.cn/" }, content:"壹卡会"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://bank.pingan.com/index.shtml" }, content:"平安银行"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://www.xsme.com/web/" }, content:"平安交易所"}
				]}
			]},
			{classes:"copyright", components:[
				{classes:"text", tag:"span", content:"壹钱包权所有 2013-2016 壹钱包版权所有 粤ICP备11100138号-5"},
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
		if(Master.session.getToken()) {
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
				role: "admin",
				token: viewModel.get("token")
			}
			// save auth ticket entity.
			Master.session.saveAuthenticateTicket(user);
			this.updateLoginState(true);
			context.closeDialog();
		} else {
			// login failed.
			context.showAuthStatus(loginStatus.retMessage);
		}
		context.hideSpinner();
	}
});