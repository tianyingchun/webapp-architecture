/**
 * This help class designed to save user history url hash change ,
 * and user custmoized data storage.
 */
enyo.setPath("Master.HistorySupport", {
	name: "Master.HistorySupport",
	//*@ public get/set user chosen api language.
	_apiLanguageKey: ApiLanguage.storageKey,

	saveUserApiLanguage: function (language) {
		Master.storage.add(this._apiLanguageKey, {val: language});
	},
	getUserApiLanguage: function (){
		var apiLanguage = Master.storage.get(this._apiLanguageKey);
		return apiLanguage && apiLanguage.val || Master.config.defaultAPILanguage;
	},

	//*@protected
	prepare:function (str) {
		return str[0] === "#"? str.slice(1): str;
	},
	/**
	 * Provider entry to redirect to pages hash change.
	 * @param  {string} loc #home/index
	 */
	location: function(loc) {
		// this.zLog("loc: ",loc);
		window.location.href = "#"+loc;
	},
	home: function () {
		window.location.href="#home/index";
	}
});