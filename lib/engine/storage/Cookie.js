(function (enyo) {
	//@private method for set get cookie value.
	var cookie = function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            if (enyo.isObject(value)) {
                value = JSON.stringify(value);
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = enyo.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            if (cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = JSON.parse(cookieValue);
                }
                catch (e) {
                	enyo.error("Master.store.cookie.get() exceptin!" , e);
                }
            }
            return cookieValue;
        }
    };
    /**
	 * @class Master.store.Cookie
	 * @interface get(key), add(key,obj,opts), remove(key),removeAll()
	 * @description the Cookie strategy for store in engine.
	 */
    enyo.kind({
		name: "Master.storage.Cookie",
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
				return cookie(key);
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
		 * @param {object} options the configurations for storage.
		 */
		add: function (key, obj, opts) {
			if (enyo.isObject(obj)) {
				cookie(key, obj, opts);
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
				cookie(key, null);
				return true;
			} else {
				return false;
			}
		},
		removeAll: function () {
			this.zLog("remove all storage keys data, have not implemented!");
		}
	});
})(enyo);
