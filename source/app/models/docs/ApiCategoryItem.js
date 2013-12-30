enyo.kind({
	name: "Master.models.docs.ApiCategoryItem",
	kind: "Master.Collection",
	model: "Master.models.docs.ApiItem",
	// api configrations for specific category item.
	api: {
		url: "/api/category",
		headers: { Authorization: "" }, 
		cache: {
			enabled: true,
			cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
		},
		dto: "apiCategoriesDataDTO"
	},
	/**
	 * Get all api item list from an specific category.
	 * @param {number} categroyId specific category id.
	 * @param  {function} fn the callback function for api doc categories.
	 * @return {void}
	 */
	getApiCategoryItem: function (categroyId, fn) {
		this.fetch({
			postBody: { categoryId: categoryId },
			callback: fn
		});
	},
	/**
	 * Get category item info, it should be contains all api list for this category.
	 */
	apiCategoriesItemDTO: function (data) {
		this.zLog(data);
	}
});	