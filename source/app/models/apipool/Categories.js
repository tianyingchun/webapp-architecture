enyo.kind({
	name: "Master.models.apipool.Categories",
	kind: "Master.Collection",
	mixins:[
		"Master.models.CategoryDTOSupport"
	],
	model: "Master.models.apipool.CategoryItem",
	// api configrations for api categories.
	apis: {
		allcategories: {
			url: "/categories",
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
	getApiCategories: function (fn) {
		this.fetch({
			apiKey: "allcategories",
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
		this.categoryBasicInfoDTO(data, result, 0);
		
		this.zLog("conterted categories: ", result);
		this.sortCategories(result);
		return result;
	},
	sortCategories: function (categories) {
		if(enyo.isArray(categories)){
			categories.sort(function (a, b) {
				return a.displayOrder > b.displayOrder;
			});
		}
	}
});	