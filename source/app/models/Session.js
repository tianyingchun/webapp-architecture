enyo.kind({
	name: "Master.models.Session",
	kind: "enyo.Object",
	mixins: [
		"Master.ClassSupport"
	],
	constructor: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);	
			this.initialize();
		};
	}),
	published: {
		user: null,
		token: null
	},
	//@private
	_initialized: false,
	/**
	 * Application initialization entry.
	 * we can put some initialization logics here it will block router hash changes event util it return true.
	 * @return true/false.
	 */
	initialize: function () {
		this.zLog("do session global initialize....");
		this._authKey = "_auth_";
		//each refresh app page, check if has valid auth ticket information.
		this._verifyTokenValidation();

		// do some customized logics.
		 this._initialized = true;
	},
	/**
	 * A function used to check current application if initialized.
	 * if false we can't do anything and it will timer to wait _initialized varible equles true
	 * @return {Boolean} [description]
	 */
	hasInitialized: function () {
		return this._initialized;
	},
	//*@private helper for check if exist validated user session.
	_verifyTokenValidation: function () {
		// get current user from current session or localstorage.
		var user = this.get("user") || this.getAuthenticateTicket();
		if (user) {
			var lastActive = user.lastActive || 0;
			// if has existed logined user session.
			var diff = enyo.perfNow() - lastActive;
			if (diff < Master.config.tokenExpire) {
				// re-save the authenticates.
				this.saveAuthenticateTicket(user);
				return true;
			} else {
				// clear token.
				Master.storage.remove(this._authKey);
				return false;
			}
		}
		return false;
	},
	//*@public invoked in controller security.
	hasAuthorization: function () {
		return this._verifyTokenValidation() || false;
	},	
	// *@logout
	logout: function () {
		Master.storage.remove(this._authKey);
		this.set("user", null);
		this.set("token", null);
	},
	// get current user session token.
	getAuthenticateTicket: function () {
		var encryptedObj= Master.storage.get(this._authKey);
		var encryptedStr = encryptedObj && encryptedObj.auth;
		var user = null;
		if (encryptedStr) { 
			try {
				user =enyo.json.parse(utility.AES.decrypt(encryptedStr));
			} catch(e) {
				this.zError(e);
			}
		}
		return user;
	},
	//*@public while user login success, save it's information.
	saveAuthenticateTicket: function (user) {
		// assign new system clock date for current user session.
		user.lastActive = enyo.perfNow();
		this.set("user", user);
		this.set("token", user.token);
		var encrypted = utility.AES.encrypt(user);
		Master.storage.add(this._authKey, {auth: encrypted});
	}
});