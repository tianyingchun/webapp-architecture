enyo.kind({
	name: "Master.models.apipool.CategoryItem",
	kind: "Master.Model",
	model: "Master.models.apipool.ApiItem",
	// api configrations for specific category item.
	api: {
		url: "/api/category",
		headers: { Authorization: "" }, 
		cache: {
			enabled: true,
			cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
		},
		dto: "categoryDetailDTO"
	},
	// for model, defined record schema.
	attributes: {
		categoryId: "",
		categoryName: "",
		categoryDetails: []
	},
	// default values for record schema.
	defaults: {
		categoryDetails: [
			{ detail1: "detail1"}
		]
	},
	/**
	 * Get category details for an specific category.
	 * @param {number} categroyId specific category id.
	 * @param  {function} fn the callback function for api doc categories.
	 * @return {void}
	 */
	getCategoryDetail: function (categoryId, fn) {
		this.fetch({
			postBody: { categoryId: categoryId },
			callback: fn
		});
	},
	/**
	 * Get category item info, we can fetch all detail information for current category item.
	 */
	categoryDetailDTO: function (data) {
		this.zLog(data);
		data = data || {};
		var result = {
			categoryId: data.id,
			categoryName: data.name,
			categoryDetails: data.details
		};
		return result;
	}
});	