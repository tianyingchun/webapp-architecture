enyo.kind({
	name: "Master.models.apipool.CategoryItem",
	kind: "Master.Collection",
	model: "Master.models.apipool.ApiItem",
	// api configrations for specific category item.
	api: {
		url: "/api/apilist",
		headers: { Authorization: "" }, 
		cache: {
			enabled: true,
			cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
		},
		dto: "apiListDTO"
	},
	// for collection, only allow us use published defined, don't use defaults to defined fields.
	published: {
		categoryId: "",
		categoryName: ""
	},
	/**
	 * Get all api item list from an specific category.
	 * @param {number} categroyId specific category id.
	 * @param  {function} fn the callback function for api doc categories.
	 * @return {void}
	 */
	getApiList: function (categroyId, fn) {
		this.fetch({
			postBody: { categoryId: categoryId },
			callback: fn
		});
	},
	/**
	 * Get category item info, it should be contains all api list for this category.
	 */
	apiListDTO: function (data) {
		this.zLog(data);
	}
});	