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
						apiId: item._id,
						apiKey: item.key,
						apiName: item.name,
						displayOrder: item.displayOrder,
						categoryId: item._category,
						isDisplay: typeof(item.isDisplay) == "undefined"? true : item.isDisplay
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
					params: _response && _response.params || [],
					headers: _response && _response.headers || []
				};
				// examples
				var _example = details.example;
				result.example = {
					postCommand: _example && _example.postCommand,
					request: _example && _example.request,
					response: _example && _example.response
				};
				// sdk
				var _sdk = details.sdk;
				result.sdk = _sdk;
				// question answers
				var _questions = details.questions;
				result.questions = _questions || [];
			}
			return result;
 		}
	});
})(enyo);