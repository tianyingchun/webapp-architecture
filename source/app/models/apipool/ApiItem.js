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
		details: {}
	},
	// default values for record schema.
	defaults: {
		details:{}
	},
	/**
	 * Get current api details by api id.
	 * @param {number} apiId specific api item id.
	 * @param  {function} fn the callback function for api detail information.
	 * @return {void}
	 */
	getApiDetail: function (key, fn) {
		fn = fn || enyo.nop;
		// first check if current model has cached in enyo.store instance, avoid create the same instance with the same primaryKey
		// all enyo.Model instance will cached in enyo.store.
		// and BTW we can also cache model instance in controller, make our model instance only create once in 
		// the whole life cycle.
		var record = this.store.findLocal(this.kindName, {apiKey:key});
		if(enyo.isArray(record) && record.length) {
			fn(record[0]);
		} else if(enyo.isObject(record)) {
			fn(record);
		} else {
			this.fetch({
				apiKey: "apiDetail",
				data: { key: key },
				callback: fn
			});
		}
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


