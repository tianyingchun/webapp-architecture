enyo.kind({
	name: "Master.models.apipool.Categories",
	kind: "Master.Collection",
	model: "Master.models.apipool.CategoryItem",
	// api configrations for api categories.
	apis: {
		allcategories: {
			isDefault: true,
			url: "/api/categories",
			// cache: {
			// 	enabled: true,
			// 	cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
			// },
			dto: "apiCategoriesDataDTO"
		}
	},
	// default we don't need to instance all records as specificed model. 
	instanceAllRecords: true,

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
		this.zLog(data);
		data = data && enyo.isArray(data) ? data : [];
		var result = [];
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			result.push({
				categoryId: item.id,
				categoryName: item.name
			});
		};
		return result;
	}
});	