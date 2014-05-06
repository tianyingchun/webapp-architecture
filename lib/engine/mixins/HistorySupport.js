/**
 * This help class designed to save user history url hash change ,
 * and user custmoized data storage.
 */
enyo.setPath("Master.HistorySupport", {
	name: "Master.HistorySupport",
	//*@ private get/set user chosen api language.
	_apiLanguageKey: "apiLanguage",

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
		
		window.location.href = "#"+this.prepare(loc);
	},
	// for location to specific api item.
	locationApiItem: function (key) {
		var apiHash = "node/"+key;;
		this.location(apiHash);
	},
	// for left dock category node hash.
	locationCategoryItem: function (key) {
		var categoryHash = "node/"+key;
		this.location(categoryHash);
	},
	// redirect to admin profile category list page.
	locationAdminCategoryList: function () {
		var categoryListHash = "profile/category/list";
		this.location(categoryListHash);
	},
	// redirect to admin profile api list page.
	locationAdminApilist: function () {
		var apilistHash = "profile/api/list";
		this.location(apilistHash);
	},
	home: function () {
		window.location.href="#home/index";
	}
});