enyo.kind({
	name: "Master.models.apipool.ApiItem",
	kind: "Master.Model",
	// api configrations for specific category item.
	api: {
		url: "/api/detail",
		headers: { Authorization: "" }, 
		cache: {
			enabled: true,
			cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
		},
		dto: "apiDetailDTO"
	},
	// api detail default fields. it will be auto instanced.
	defaults:{
		apiId: "",
		apiName: "",
		apiDesc: ""
	},
	/**
	 * Get current api details by api id.
	 * @param {number} apiId specific api item id.
	 * @param  {function} fn the callback function for api detail information.
	 * @return {void}
	 */
	getApiDetail: function (apiId, fn) {
		this.fetch({
			postBody: { apiId: apiId },
			callback: fn
		});
	},
	/**
	 * Get category item info, it should be contains all api list for this category.
	 */
	apiDetailDTO: function (data) {
		this.zLog(data);
	}
});	


