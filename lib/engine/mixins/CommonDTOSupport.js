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
	var setApiRestInfo = function (context, retCode, retMessage) {
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
		apiDefaultDTO: function (data) {
			// mixin restfull interface parameters into current model property: restInfo.
			var retMessage = Master.locale.get("SUCCESS", "message");
			
			this._setRestInfo(this, 1, retMessage);
			// do some basic convert.
			return data.Info;
		},
		/**
		 * Used to convert failed request response into uniform response result to biz.
		 * Copy retCode, retMessage into current model,collection object
		 * @param  {object} apiOtps the api call option data.
		 * @returns {void} no return data.
		 */
		apiExceptionDTO: function (apiOtps, res){
			var info = {code: "", message:""};
			// do some stuff here for excetion handling.
			var status = res && res.xhrResponse.status;
			var errorBody = res.xhrResponse.body;
			if(errorBody) {
				info = enyo.json.parse(errorBody).Info;
			}
			this.zError("apiOpts: ", apiOtps, "res:", res);
			// Uniform error data.
			var retCode = ErrorCode[info.code] || ErrorCode[status] || status;
			var serverMsg = info.message;
			serverMsg = enyo.isObject(serverMsg) ? enyo.json.stringify(serverMsg): serverMsg;
			var retMessage = serverMsg || Master.locale.get(retCode, "message");
			this._setRestInfo(this, retCode, retMessage);
			// exception we don't return anything.
			return null;
		},
		//*@ protected.
		_setRestInfo: function (context, code, message) {
			setApiRestInfo(context, code, message);
		}
	});
})(enyo);