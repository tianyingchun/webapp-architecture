enyo.kind({
	name: "Master.models.apipool.Categories",
	kind: "Master.Collection",
	model: "Master.models.apipool.CategoryItem",
	// api configrations for api categories.
	api: {
		url: "/api/categories",
		// cache: {
		// 	enabled: true,
		// 	cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
		// },
		dto: "apiCategoriesDataDTO"
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
			callback: fn
		});
	},
	apiCategoriesDataDTO: function (data) {
		return data;
	}
});	