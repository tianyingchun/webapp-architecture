(function (enyo) {
	enyo.kind({
		name: "Master.Locale",
		kind: "enyo.Object",
		mixins: [
			"Master.ClassSupport"
		],
		// private 
		_destLocaleLang: null,

		published: { 
			// our supported locale language.
			supportedLang: [ { "zh-CN": "zh" }, {"en-US": "en"} ]
		},
		constructor: function () {
			this._defaultLocale = arguments[0] && "zh-CN";
			// set locale language.
			this.setLocaleLanguage();
		},
		/**
		 * set language saved to localstorage/cookie/websql and so on.
		 * @param {string} language zh-CN, en-US,...
		 */
		setLanguage: function (language) {
			Master.storage.add("language", { val: language });
			this.setLocaleLanguage();
		},
		getLanguage: function (){
			var language = Master.storage.get("language");
			return (language && language["val"]) || this._defaultLocale;
		},
		/**
		 * Reset locale settings.
		 * @protected
		 */
		setLocaleLanguage: function () {
			// initialize the user selected language.
 			var storageLanguage = this.getLanguage();
			// zh-CN, en-US			
			var lang = storageLanguage || navigator.language || navigator.browserLanguage|| navigator.systemLanguage;

			this.zLog("current dest locale lang: "+ lang);

			if (!this.getLocaleInstance(lang)) {
				this.zWarn("get locale instance failed! current lang: "+ lang);
				// try get default locale instance.
				this.getLocaleInstance(this._defaultLocale);
			}
		},
		/**
		 * Get current local factory instance.
		 * @protected
		 * @param  {string} lang the locale language "zh-CN", "en-US"
		 * @return {boolean} load locale provider.
		 */
		getLocaleInstance: function (lang) {
			//search supported language
			var isFind = false;
			for (var i = 0; i < this.supportedLang.length; i++) {
				var langShort = this.supportedLang[i][lang];
				if (langShort) {
					this._destLocaleLang = Master.lang[langShort];
					// save this lang.
					this.lang = lang;
					isFind = true;
					break;
				}
			};
			return isFind;
		},
		/**
		 * Public method to get specific locale string.
		 * e.g. Master.locale.get("checkout", "button");
		 * @public
		 * @param  {string} key     locale key
		 * @param  {string} context locale context 
		 * @return {string}         the resource value of current locale
		 */
		get: function (key, context) {
			var localeStr = "";
			if (context) {
				localeStr = this._destLocaleLang[context][key];
			} else {
				localeStr = this._destLocaleLang[key];
			}
			if (!localeStr) {
				this.zError("get locale failed:  key: " + key +" context: "+ context +" lang:" + this.lang);
			} 
			return localeStr;
		}
	
	});
	// auto instance locale.
	Master.locale = new Master.Locale("zh-CN");
})(enyo);

