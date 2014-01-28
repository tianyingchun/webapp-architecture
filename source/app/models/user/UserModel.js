enyo.kind({
	name: "Master.models.user.UserModel",
	kind: "Master.Model",
	apis: {
		getUserInfo:{
			url: "/user",
			cache:false,
			dto: "userInfoDTO"
		}
	},
	attributes: {
		userName: "",
		email: "",
		mobile:""
	},
	// *@private convert user raw data.
	userInfoDTO: function (data) {
		this.zLog("userInfo data: ",data);
	},
	
});