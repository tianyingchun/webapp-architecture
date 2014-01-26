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
	urlRoot:"http://localhost:8080/",
	// set default language for apipool sdk.
	defaultAPILanguage: "java",
	// default token, we will remove this item in the next phase.
	// HiU4GlEb8SVQVJtre58416bY1F234Ev2
	defaultToken: "",

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