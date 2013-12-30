enyo.kind({
	name: "Master.models.docs.ApiCategories",
	kind: "Master.Collection",
	model: "Master.models.docs.ApiCategoryItem",
	// api configrations for api categories.
	api: {
		url: "/api/categories",
		// cache: {
		// 	enabled: true,
		// 	cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
		// },
		dto: "apiCategoriesDataDTO"
	},
	defaults: {
		name: "",
		id: ""
	},
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