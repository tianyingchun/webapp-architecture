/**
 * Util for all normal validation helper methods.
 * It extends utilitiy.js
 */
enyo.mixin(utility, {
	/**
	 * 
	 * 
	 * @method isRequired
	 */
	isRequired: function(obj) {
		return !this.isEmpty(obj);
	},


	
	/**
	 * Check to see whether url is valid
	 * @param  {string}  url
	 * @return {Boolean}
	 */
	isUrl: function(url) {
		return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
	},

	/**
	 * 
	 * 
	 * @method isAlpha
	 * @param value
	 * @returns {Boolean}
	 */
	isAlpha: function(value) {
		if((value + "").match(new RegExp("[\\\\\#,\`?>\\]</:;}\"\[|{~=!@\\$%\\^&\\*\\(\\)\\+_%0-9\.\-]"))) {
			return false;
		} else {
			return true;
		}
	},

	/**
	 * 
	 * 
	 * @method isAddress
	 * @param value
	 * @returns {Boolean}
	 */
	isAddress: function(value) {
		if((value +"").match(new RegExp("[!@\\`\\~\\=\\[\\]\\{\\}\\|\\\\\<\\>\\?\\$%\\^\\*\\+_]"))) {
			return false;
		} else {
			return (value +"").match(new RegExp("[A-Za-z]"));
		}
	},	

	/**
	 * Check the url is validate website.
	 * @param  {[type]}  value
	 * @return {Boolean}
	 */
	isWebsite: function(value) {
		var retval = value.match(/^[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
		if (retval) {
			//DO ANY OTHER FANCY STUFF HERE
		}
		return retval;
	},

	/**
	 * check to see if value is number.
	 * @param  {string}  value
	 * @return {Boolean}
	 */
	isNumeric: function(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},
	
	/**
	 * Check whether email is valid.
	 * @param  {string}  email
	 * @return {Boolean}
	 */
	isEmail: function(email) {
		email = enyo.trim(email);
		var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (!pattern.test(email)) {
			return false;
		}
		return true;
	},
	/**
	 * Check if is white string
	 * @param  {string}  value
	 * @return {Boolean}
	 */
	isWhite: function(value) {
		if ((value + "").match(new RegExp("[#!@\\$%\\^&\\*\\(\\)\\+_%]"))) {
			return false;
		} else {
			return true;
		}
	},


	/**
	 * 
	 * 
	 * @method isImage
	 * @param value
	 * @returns {Boolean}
	 */
	isImage: function(value) {
		return (value + "").match(new RegExp("\\.((jpg)|(png))$"));
	},
	
	/**
	 * 
	 * 
	 * @method isZip
	 * @param value
	 * @returns {Boolean}
	 */
	isZip: function(value) {
		return (value + "").match(new RegExp("^\\d{5}(-\\d{4})?$"));
	},

	/**
	 * 
	 * 
	 * @method isVersion
	 * @param value
	 * @returns {Boolean}
	 */
	isVersion: function(value) {
		return (value + "").match(new RegExp("^\\d+\\.\\d+\\.\\d+"));
	},

    /**
     * 
     * 
     * @method isCC
     * @param value
     * @returns {Boolean}
     */
    isCC: function(value) {
        var val = this.trim(value);
        val = val && val.replace && val.replace(/\D*/g,'');
        return this.isNumeric(val) && val.length == 16;
    },

    /**
     * 
     * 
     * @method isCVV
     * @param value
     * @returns {Boolean}
     */
    isCVV: function(value) {
        var val = this.trim(value);
        return this.isNumeric(val) && val.length >= 3 && val.length <= 4 ;
    },



    /**
     * 
     * 
     * @method isCCExp
     * @param value
     * @returns {Boolean}
     */
    isCCExp: function(value) {
    	var month = value.split("/")[0];
    	var year = value.split("/")[1];
    	if(month && year){
	    	month = month.trim();
	    	year = year.trim();
    	}
    	else{ 
    		return false; 
    	}
    	var dateVal = [year,month,'01'].join('-');
        var date1 = new Date();
        var date2 = new Date(dateVal);
        return date1 < date2;
    },
	
    /**
     * 
     * 
     * @method isLimit
     * @param value
     * @returns {Boolean}
     */
    isLimit:function(value){
        return value.length >= 6;
    },


	/**
	 * 
	 * 
	 * @method stripCharsInBag
	 * @param s
	 * @param bag
	 */
	stripCharsInBag: function(s, bag) {
		var i;
	    var returnString = "";
	    // Search through string's characters one by one.
	    // If character is not in bag, append to returnString.
	    for (i = 0; i < s.length; i++) {   
	        // Check that current character isn't whitespace.
	        var c = s.charAt(i);
	        if (bag.indexOf(c) == -1) returnString += c;
	    }
	    return returnString;
	},
	/**
	 * For current router hash parameter format #/node/{params}/
	 * @param  {string}  value the hash value
	 */
	isHashUrl: function (value) {
		var regex = /^[a-zA-Z0-9-_%]+$/;
		return regex.test(value);
	},
    /**
     * 
     * @method trim
     * @param obj
     * @returns 
     */
    trim: function (obj) {
        obj = obj || "";
		if (obj && obj.replace) return obj.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		return obj;
	}
});
