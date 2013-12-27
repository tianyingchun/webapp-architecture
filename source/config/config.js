enyo.singleton({
	name: "Master.config",
	kind: null,
	constructor: function () {
		// manul config localstorage strategy.
		this.setStoragePolicy();
	},
	// #region properties.
	storageStrategy: "localstorage", //cookie, websql,localstorage
	// default locale if system can't find the specific locale setting.
	defaultLocale: "zh-CN",
	defaultHash: "home/index",// redirect to home/index page if we can't find corresponding router handler.
	appName: "z",// define app name is z (lowercase), z is so cool ^-^.
	// service request url root.
	urlRoot:"http://locahost:8000/",
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