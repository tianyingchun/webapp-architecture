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
		this._token = null;
		this._user = null;

		//each refresh app page, check if has valid auth ticket information.
		var user = this.getAuthenticateTicket();
		if (user) {
			this._user = user;
			this._token = user.token;
		}

		// do ajax initialing maybe .
		// 
		// 
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
	getToken: function () {
		return this._token;
	},
	getUser: function () {
		return this._user;
	},
	// *@logout
	logout: function () {
		Master.storage.remove(this._authKey);
		this._user = null;
		this._token = null;
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
		this._token = user.token;
		this._user = user;
		var encrypted = utility.AES.encrypt(user);
		Master.storage.add(this._authKey, {auth: encrypted});
	}
});