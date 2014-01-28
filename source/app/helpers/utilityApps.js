
/**
 * Util for all normal application helper methods.
 * It extends utilitiy.js
 */
(function() {
    //*@protected
    var normalize = function (url) {
        return url.replace(/([^:]\/)(\/+)/g, "$1");
    };
    var http = /^http/;
    var getLocation = function () {
        var u = location.protocol,
            p = location.pathname.split("/");
        u += ("//" + location.host);
        if (p.length > 1 && p[p.length-1].match(/\./)) { p.pop(); }
        u += ("/" + p.join("/"));
        return u;
    };
	enyo.mixin(utility, {
		/**
	     * Build resource url.
	     * @param  {object} opts {url:"", getUrl:"",urlRoot:""}
	     */
	    buildUrl: function (opts) {
	        // giving precedence to a _url_ in the options, check for a _getUrl_ method
	        // and default back to the _records_ own _url_ property
	        var u = opts.url || (enyo.isFunction(opts.getUrl) && opts.getUrl()); 
	        if (!http.test(u)) {
	            u = (opts.urlRoot || getLocation()) + "/" + u;
	        }
	        return normalize(u);
	    },
	    //*@ public conver josn into url params string  with "?"
	    toParams: function (obj) {
	    	var parts = [];
		    for (var key in obj) {
		        if (obj.hasOwnProperty(key)) {
		            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
		        }
		    }
		    return "?" + parts.join('&');
	    },
	    // *@ get oauth login url.
	    getOauthLoginUrl: function () {
	    	var oauth = Master.config.oauth; 
	    	var loginUrl = oauth.loginUrl;
	    	var callbackUrl = oauth.callbackUrl && this.buildUrl({url: oauth.callbackUrl});
	    	// request params.
	    	var params = {
	    		response_type: oauth.response_type,
	    		client_id: oauth.client_id,
	    		scope: oauth.scope,
	    		redirect_uri:callbackUrl
	    	};
	    	return loginUrl+this.toParams(params);
		}
	});
})();