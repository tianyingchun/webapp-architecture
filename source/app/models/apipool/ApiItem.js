enyo.kind({
	name: "Master.models.apipool.ApiItem",
	kind: "Master.Model",
	mixins: [
		"Master.models.ApiDTOSupport"
	],
	// api configrations for specific category item.
	apis: {
		apiDetail:{
			url: "/api/query",
			headers: { Authorization: "" }, 
			cache: {
				enabled: true,
				cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
			},
			dto: "apiDetailDTO"
		},
		// add new api.
		addNewApi:{
			url: "/api",
			cache: false,
			dto: "apiDetailDTO"
		},
		// update api information.
		updateApiInfo: {
			url: function() {
				return "/api/"+this.get("apiId");
			},
			cache: false,
			dto: "apiDetailDTO"
		},
		// remove api 
		destroyApi: {
			url: function() {
				return "/api/"+this.get("apiId");
			},
			cache: false
		}
	},
	// it will automatically append the url request if it has value.
	// Note: the enyo.store is global memory model instance managerment
	// we need to maually manager this object.
	primaryKey:"apiKey", //default is "id"
	// api detail default fields. it will be auto instanced.
	attributes:{
		apiId: "",
		apiKey: "",
		apiName: "",
		displayOrder:0,
		isDisplay: true,
		details: {}
	},
	//*@ private help method for preparing the submit data.
	_getPostInfo: function (apiInfo) {
		var _data = enyo.clone(apiInfo);
		_data.key = _data.apiKey;
		delete _data.apiKey;
		_data.name = _data.apiName;
		delete _data.apiName;

		return enyo.json.stringify(_data);
	},
	/**
	 * Get current api details by api id.
	 * @param {number} apiId specific api item id.
	 * @param  {function} fn the callback function for api detail information.
	 * @return {void}
	 */
	getApiDetail: function (key, fn) {
		fn = fn || enyo.nop; 
		this.fetch({
			apiKey: "apiDetail",
			data: { key: key },
			callback: fn
		}); 
	},
	//@public new api details.
	addNewApi: function (apiInfo, fn){
		this.setObject(apiInfo);
		this.commit({
			apiKey: "addNewApi", 
			method: "POST",
			data: this._getPostInfo(apiInfo),
			callback: fn
		});
	},
	//*@ public
	updateApiInfo: function (apiInfo, fn) {
		this.setObject(apiInfo);
		this.commit({
			apiKey: "updateApiInfo", 
			method: "PUT",
			data: this._getPostInfo(apiInfo),
			callback: fn
		})
	},
	//*@ destroy
	destroyApi: function (apiId, fn) {
		this.set("apiId", apiId);
		this.destroy({
			apiKey: "destroyApi",
			callback:fn
		})
	},
	/**
	 * Get category item info, it should be contains all api list for this category.
	 */
	apiDetailDTO: function (data) {
		var basic = data && enyo.isArray(data) ? data : [data];
		var tempBasicResult = [], result = {};
		this.apiBasicInfoDTO(basic, tempBasicResult);		
		enyo.mixin(result, tempBasicResult[0]);
		result.details = this.apiDetailInfoDTO(basic[0]);
		this.zLog("converted data: ", result);
		return result;
	}
});	


