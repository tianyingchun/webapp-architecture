enyo.kind({
	name: "Master.views.user.Detail",
	kind: "Master.View",
	classes:"profile-user-info",
	handlers: {
    	onValidationComplete:"formValidationSubmit"
    },
	components: [
		{formType:"login", submitButtonStyles:"btn btn-primary",submitButtonText:"更新用户密码", kind:"widgets.forms.FormDecorator", components: [
			{kind:"onyx.Groupbox", components: [
				{kind: "onyx.GroupboxHeader", content: "修改管理员信息"},
				{classes:"form-item", components:[
					{ classes:"title", content:"用户名: "},
					{ name:"login_username", placeholder:"admin name", kind:"widgets.forms.InputDecorator", tipMessage:"用户名称必须填写！", validation: {required:"必填字段！"}}
				]},
				{classes:"form-item", components:[
					{ classes:"title", content:"输入新密码: "},
					{ name:"login_password", placeholder:"new password",type:"password", kind:"widgets.forms.InputDecorator", tipMessage:"用户密码必须填写！", validation: {required:"必填字段！"}}
				]},
				{classes:"result", name:"modifyResult"}
			]}
		]},
	],
	formValidationSubmit: function (inSender, inEvent) {
		var validationResult = inEvent;
		var $originator = inEvent.originator;
		var formType = $originator.formType;
		this.zLog("form validation result", validationResult);
		// success/failed.
		if (validationResult.status =="success") {
			this.resetPassword();
		}

		return true;
	},
	resetPassword: function () {
		var userModel = new Master.models.user.UserModel();
		var user = {
			username: this.$.login_username.getValue(),
			password: this.$.login_password.getValue(),
		};
		userModel.resetPassword(user, this.bindSafely("resetPwdCallback"));

	},
	resetPwdCallback: function (viewModel) {
		this.zLog(viewModel);
		var restInfo = viewModel.restInfo;
		if(restInfo.retCode==="1") {
			this.$.modifyResult.removeClass("error");
			this.$.modifyResult.addClass("success");
			this.$.modifyResult.setContent("恭喜你已经更新成功，建议你注销后重新登陆!"); 
		} else {
			this.$.modifyResult.addClass("error");
			this.$.modifyResult.removeClass("success");
			this.$.modifyResult.setContent(restInfo.retMessage);
		}
	}
});