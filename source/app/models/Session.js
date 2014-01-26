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
		var _this = this;
		// do ajax initialing maybe .
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
	//*@ public get current user session token.
	getToken: function () {
		return Master.config.defaultToken;
	}
});