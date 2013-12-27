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
		 */
		defaultDTO: function (opts, res) {
			var result = {
				retCode: 1,
				retMessage: Master.locale.get("success", "message")
			};
			// if use  has another customized dto need to convert again.
			var customizedDTO = opts && opts.dto;
			if (customizedDTO && enyo.isFunction(customizedDTO)) {
				result.info = customizedDTO(opts, res);
			} else {
				result.info = res;
			}
			return result;
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
		}
	});
})(enyo);