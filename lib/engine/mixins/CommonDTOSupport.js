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
		defaultDTO: function (data, all) {
			
		}
	});
})(enyo);