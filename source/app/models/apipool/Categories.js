enyo.kind({
	name: "Master.models.apipool.Categories",
	kind: "Master.Collection",
	mixins:[
		"Master.models.CategoryDTOSupport"
	],
	model: "Master.models.apipool.ApiItem",
	// api configrations for api categories.
	apis: {
		allcategories: {
			url: "/apis",
			// cache: {
			// 	enabled: true,
			// 	cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
			// },
			dto: "apiCategoriesDataDTO"
		}
	},
	// default we don't need to instance all records as specificed model. 
	instanceAllRecords: false,

	/**
	 * Get all api doc categories.
	 * @param  {function} fn the callback function for api doc categories.
	 * @return {void}
	 */
	getApiCategories: function (fn, fromLevel, toLevel) {
		fromLevel = fromLevel || 0;
		toLevel = toLevel || 20;
		this.fetch({
			apiKey: "allcategories",
			url: function () {
				return "/apis/"+fromLevel+"/"+toLevel;
			},
			callback: fn
		});
	},
	/**
	 * Convert category list data
	 * @param  {object} data category data, it should be array, also can be another object.
	 */
	apiCategoriesDataDTO: function (data) {
		data = data && enyo.isArray(data) ? data : [];
		var result = [];
		// convert source data and saved into result.
		this.categoryBasicInfoDTO(data, result);
		
		this.sortCategories(result);
		this.zLog("converted categories: ", result);
		
		return result;
	},
	sortCategories: function (categories) {
		if(enyo.isArray(categories)){
			categories.sort(function (a, b) {
				return a.displayOrder - b.displayOrder; // compitible for ie, chrome firefox.
			});
		}
	}
});	