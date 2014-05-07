enyo.kind({
	name: "Master.models.apipool.ApiList",
	kind: "Master.Collection",
	mixins:[
		"Master.models.ApiDTOSupport"
	],
	model: "Master.models.apipool.ApiItem",
	apis: {
		apiList: {
			url: "/apis",
			dto: "apiListItemDTO"
		}
	},
	//@public
	getApiList: function (fn) {
		this.fetch({
			apiKey: "apiList",
			callback: fn
		});
	},
	// api list item dto.
	apiListItemDTO: function (data) {
		data = data && enyo.isArray(data) ? data : [];
		var result = [];
		// convert source data and saved into result.
		this.apiBasicInfoDTO(data, result);
		this.zLog("conterted api basic info list: ", result);
		this.sortApis(result);
		return result;
	},
	sortApis: function (apis) {
		if(enyo.isArray(apis)){
			apis.sort(function (a, b) {
				return a.displayOrder - b.displayOrder;
			});
		}
	}
});