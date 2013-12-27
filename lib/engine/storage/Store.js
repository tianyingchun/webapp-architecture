
(function (enyo) {
	enyo.kind({
		name: "Master.Storage",
		kind: "enyo.Object",
		mixins: [
			"Master.ClassSupport"
		],
		// private variable.
		_storageStrategy: "cookie",

		// current storage instance.
		_storageInstance:null,

		constructor: enyo.inherit(function (sup) {
			return function () {
				//sup.apply(this, arguments);
				this._storageStrategy = arguments[0] || "cookie";
				this.initializeStorage();
			};
		}),
		/**
		 * initialize storage strategy .
		 */
		initializeStorage: function () {
			// our self stuff here.
			switch (this._storageStrategy.toLocaleLowerCase()) {
				case "cookie":
					this._storageInstance = new Master.store.Cookie();
				break;
				case "localstorage":
					this._storageInstance = new Master.store.LocalStorage();
				break;
				case "websql":
					this._storageInstance = new Master.store.Websql();
				break;
				default:
					this._storageInstance = new Master.store.LocalStorage();
				break;
			}
			this.zLog("current storage instance is :", this._storageInstance && this._storageInstance.kindName);

		},
		/**
		 * manul set storage strategy model
		 * @param {string} strategy option value: 'cookie', 'localstorage', 'websql'
		 */
		setStrategy: function (strategy) {
			this.zLog("setStrategy...", strategy);
			this._storageStrategy = strategy;
			// re initializestorage.
			this.initializeStorage();
		},
		/**
		 * Get value of specific key.
		 * @param  {string} key storage key.
		 * @return {object}     storage value.
		 */
		get: function (key) {
			return this._storageInstance.get(key);
		},
		/**
		 * Set values by specific key.
		 * @param {string} key   the storage key.
		 * @param {object} obj must be an object.
		 */
		add: function (key, obj) {
			return this._storageInstance.add(key, obj);	
		},
		/**
		 * remove specific storaged item by specific key.
		 * @param  {string} key the storage key
		 * @return {boolean} the remove success or failed.     
		 */
		remove: function (key) {
			return this._storageInstance.remove(key);
		}
	});
	// auto instance storeage infrastures
	Master.storage = new Master.Storage();
})(enyo);
