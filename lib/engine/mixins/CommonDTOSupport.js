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
		 * @param  {object} call the call(api, xhr.....)
		 */
		rawDataConvertDTO: function (data, call) {
			this.zLog("rawDataConvertDTO..", data, call);
		},
		/**
		 * Used to convert failed request response into uniform response result to biz.
		 * @param  {object} apiOtps the api call option data.
		 * @param  {object} res     the store source instance.
		 */
		exceptionDTO: function (apiOtps, res){
			var status = res && res.xhrResponse.status;
			this.zError("apiOpts: ", apiOtps, "res:", res);
			// Uniform error data.
			var retCode = ErrorCode[status];
			var errorData = {
				retCode: retCode,
				retMessage: Master.locale.get(retCode, "message"),
				info: null
			};
			return errorData;
		},
		defaultDTO: function (data, all) {
			
		}
	});
})(enyo);