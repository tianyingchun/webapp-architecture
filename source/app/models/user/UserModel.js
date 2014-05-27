enyo.kind({
	name: "Master.models.user.UserModel",
	kind: "Master.Model",
	apis: {
		login:{
			url: "/login",
			cache:false,
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
	// login callback data dto.
	userInfoDTO: function(data, options) {
		return {
			token: data.token,
			username: data.username
		};
	}
});