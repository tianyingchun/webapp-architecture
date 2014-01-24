/**
 * @class Master.store.LocalStorage
 * @interface get(key), add(key,obj,opts), remove(key),removeAll()
 * @description the Localstorage strategy for store in engine.
 */
enyo.kind({
	name: "Master.storage.LocalStorage",
	kind: "enyo.Object",
	mixins: [
		"Master.ClassSupport"
	],
	/**
	 * Get storaged values by an specific key.
	 * @method get  contract method.
	 * @param  {string} key storage key
	 * @return {object}     the storage value.
	 */	
	get: function (key) {
		if (enyo.isString(key)) {
			var result = localStorage.getItem(key);
			try {
				return JSON.parse(result);
			} catch(e) {
				enyo.error("Master.store.LocalStorage.get() exception!");
			}
		} else {
			this.zError("the storage key must be string!");
			return null;
		}
	},
	/**
	 * Add new object to localstorage.
	 * @method add contract method.
	 * @param {string} key storage name
	 * @param {object} obj the object will stringify to local storage.
	 * @param {object} opts options the configurations for storage.
	 */
	add: function (key, obj, opts) {
		if (enyo.isObject(obj)) {
			localStorage.setItem(key, JSON.stringify(obj));
		} else {
			this.zError("the storage value must be an object!");
		}
	},
	/**
	 * Remove the item with the key 'name'.		
	 * @method remove contract method.
	 * @param  {string} key the storage key value.
	 * @return {object}     [description]
	 */
	remove: function (key) {
		if (enyo.isString(key)) {
			localStorage.remove(key);
			return true;
		} else {
			return false;
		}
	},
	removeAll: function () {
		this.zLog("remove all storage keys data, have not implemented!");
	}
});