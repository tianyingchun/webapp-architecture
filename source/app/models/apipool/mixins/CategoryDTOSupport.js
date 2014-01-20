(function (enyo) {
	enyo.setPath("Master.models.CategoryDTOSupport",{
		name: "Master.models.CategoryDTOSupport",
		/**
		 * for category basic info convert dto.
		 * { 	
		 * 		categoryId: "",
		 * 		categoryName: "",
	 	 * 		categoryKey: "",
		 *    	expanded: false,
		 * 	    childs: []
		 * }
		 * @param  {array} source the categories 
		 * @param  {array} target the target array used to save converted data
		 * @return {void}  
		 */
		categoryBasicInfoDTO: function (source, target) {
			var result = target || [];
			if (enyo.isArray(source)){
				for (var i = 0; i < source.length; i++) {
					var item = source[i];
					var convertItem = {
						categoryId: item._id,
						categoryKey: item.key,
						categoryName: item.name,
						expanded: item.expanded || false,
						isDisplay: typeof(item.isDisplay) == "undefined" ? true: item.isDisplay,
						childs: []
					};
					result.push(convertItem);
					// loop child source.
					if (item.apis && item.apis.length) {
						this.categoryBasicInfoDTO(item.apis, convertItem.childs);
					}
				};
			}
		},
		/**
		 * Convert detail information for each  category
		 * @param  {object} data the source data of category
		 * @return {object}      the converted category detail info.
		 */
		categoryDetailInfoDTO: function (details) {
			var result = {};
			if (enyo.isObject(details)) {
				result.description = details.description;
				// request.
				var _request = details.request;
				result.request =  { 
					body: _request && _request.body || "",
					payload: _request && _request.payload || "",
					params: _request && _request.params || [],
					headers: _request && _request.headers || []
				};
				// response.
				var _response = details.response;
				result.response = {
					body:  _response && _response.body || "",
					params: _response && _response.params || [],
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