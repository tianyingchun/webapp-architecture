(function (enyo) {
	if (enyo.getPath("Master.CommonDTOSupport")) {
		return;
	}
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
			// mixin restfull interface parameters into current model instance.
			this.retCode = 1;
			this.retMessage = Master.locale.get("SUCCESS", "message"); 
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
			// do some stuff here for excetion handling.
			var status = res && res.xhrResponse.status;
			this.zError("apiOpts: ", apiOtps, "res:", res);
			// Uniform error data.
			var retCode = ErrorCode[status];
			// restfull interface parameters.
			this.retCode = retCode;
			this.retMessage = Master.locale.get(retCode, "message");
		}
	});
})(enyo);