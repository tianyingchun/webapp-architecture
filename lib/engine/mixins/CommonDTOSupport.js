(function (enyo) {
	if (enyo.getPath("Master.CommonDTOSupport")) {
		return;
	}
	/**
	 * helper methods, provider unifrom restAPI return info parameters.
	 * @param {object} 	context    will mixin ret info on to context.
	 * @param  {string} retCode    the return code if success request retCode=="1", otherwise it equals "500","404",...
	 * @param  {string} retMessage ret message maybe success message, or error message.
	 */
	var generateRestInfo = function (context, retCode, retMessage) {
		context = context || window;
		var restInfo = {
			retCode: retCode ,
			retMessage: retMessage
		};
		context.restInfo = restInfo;
	};
	/**
	 * The global raw data dto supports used to directly convert source data from service.
	 */
	enyo.setPath("Master.CommonDTOSupport", {
		name: "Master.CommonDTOSupport",
		/**
		 * Used to convert raw data fetched from service.
		 * @param  {object} data the response data from service.
		 * @returns {object} the converted data.
		 */
		defaultDTO: function (data) {
			// mixin restfull interface parameters into current model property: restInfo.
			var retMessage = Master.locale.get("SUCCESS", "message");
			generateRestInfo(this, 1, retMessage); 
			// do some basic convert.
			return data;
		},
		/**
		 * Used to convert failed request response into uniform response result to biz.
		 * Copy retCode, retMessage into current model,collection object
		 * @param  {object} apiOtps the api call option data.
		 * @returns {void} no return data.
		 */
		exceptionDTO: function (apiOtps, res){
			var info = {code: "", message:""};
			// do some stuff here for excetion handling.
			var status = res && res.xhrResponse.status;
			var errorBody = res.xhrResponse.body;
			if(errorBody) {
				info = enyo.json.parse(errorBody).info;
			}
			this.zError("apiOpts: ", apiOtps, "res:", res);
			// Uniform error data.
			var retCode = ErrorCode[info.code] || ErrorCode[status];
			var retMessage = info.message || Master.locale.get(retCode, "message");
			generateRestInfo(this, retCode, retMessage);
			// exception we don't return anything.
			return null;
		}
	});
})(enyo);