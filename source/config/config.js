enyo.singleton({
	name: "Master.config",
	kind: null,
	constructor: function () {
		// do nothing.
	},
	// #region properties.
	storageStrategy: "localstorage", //cookie, websql,localstorage
	
	defaultHash: "home/index",// redirect to home/index page if we can't find corresponding router handler.
	appName: "z",// define app name is z (lowercase), z is so cool ^-^.
	// service request url root.
	urlRoot:"http://172.17.11.59:7000/",
	// set default language for apipool sdk.
	defaultAPILanguage: "java",
	cacheBust: true, // ajax cache Bust.
	// cache settings.
	cache: {
		// default enable cache.
		enabled: true,
		cacheStrategy: "websql" //localstorage, websql
	},
	// #endregion properties.
	// -------------------------------------------------------------------
	// #region methods.
	/**
	 * Assign any kind of strategy to storage factory.
	 */
	setStoragePolicy: function () {
		Master.storage.setStrategy(this.storageStrategy);
	}

	// #endregion methods.
});