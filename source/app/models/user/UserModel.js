enyo.kind({
	name: "Master.models.user.UserModel",
	kind: "Master.Model",
	apis: {
		login:{
			url: "/login",
			cache:false,
			dto: "userInfoDTO"
		},
		resetPwd: {
			url: "/user/password",
			cache: false,
			dto: "userInfoDTO"
		}
	},
	attributes: {
		username: "",
		password: "",
		lastActive:"",
		token: "",
		role: "admin"// default roles is admin.
	},
	// user login.
	login: function (user, fn) {
		this.username = user.username;
		this.password = user.password;
		this.commit({
			apiKey: "login", 
			method: "POST",
			data: {
				username: user.username,
				password: user.password
			},
			callback: fn
		});
	},
	resetPassword: function (user, newPassword, fn) {
		this.commit({
			apiKey: "resetPwd",
			method:"POST",
			data: {
				username: user.username,
				password: user.password,
				newPassword: newPassword
			},
			callback: fn
		});
	},
	// login callback data dto.
	userInfoDTO: function(data, options) {
		return {
			token: data.token,
			username: data.username
		};
	}
});