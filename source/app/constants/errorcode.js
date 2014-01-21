/**
 * Define global Error code contants
 */
(function (ns) {
	var errorCode = {
		// constant errorCode mapping.	
		"404": "HTTP_404",
		"500": "HTTP_500",
		"405": "HTTP_405",
		"400": "HTTP_400"
	};
	ns.ErrorCode = errorCode;
})(window)