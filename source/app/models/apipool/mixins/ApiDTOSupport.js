(function (enyo) {
	enyo.setPath("Master.models.ApiDTOSupport",{
		name: "Master.models.ApiDTOSupport",
		/**
		 * for category basic info convert dto.
		 * @param  {array} source the categories 
		 * @param  {array} target the target array used to save converted data
		 * @return {void}  
		 */
		apiBasicInfoDTO: function (source, target) {
			var result = target || [];
			if (enyo.isArray(source)){
				for (var i = 0; i < source.length; i++) {
					var item = source[i];
					var apiItem = {
						apiId: item.id,
						apiKey: item.key,
						apiName: item.name
					};
					if(typeof(item.isDisplay) == "undefined" || item.isDisplay == true) {
						apiItem.isDisplay = true;
					} else {
						apiItem.isDisplay = false;
					}
					result.push(apiItem);
				};
			}
		},
		/**
		 * Convert detail information for each api detail.
		 * @param  {object} data the source data of api
		 * @return {object}      the converted api detail info.
		 */
		apiDetailInfoDTO: function (details) {
			var result = {};
			if (enyo.isObject(details)) {
				result.description = details.description;
				// request.
				var _request = details.request;
				result.request =  { 
					body: _request && _request.body || "",
					params: _request && _request.params || [],
					headers: _request && _request.headers || []
				};
				// response.
				var _response = details.response;
				result.response = {
					body:  _response && _response.body || "",
					headers: _response && _response.headers || ""
				};
				// examples
				var _examples = details.examples;
				result.examples = {
					postCommand: _examples && _examples.postCommand,
					request: _examples && _examples.request,
					response: _examples && _examples.response
				};
				// sdk
				var _sdk = details.sdk;
				result.sdk = _sdk || {};
				// question answers
				var _questions = details.questions;
				result.questions = _questions || [];
			}
			return result;
 		}
	});
})(enyo);