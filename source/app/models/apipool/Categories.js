enyo.kind({
	name: "Master.models.apipool.Categories",
	kind: "Master.Collection",
	model: "Master.models.apipool.CategoryItem",
	// api configrations for api categories.
	apis: {
		allcategories: {
			url: "/api/categories",
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
		this._convertCategories(data, result);
		this.zLog("conterted categories: ", result);
		return result;
	},
	/**
	 * Convert categories array
	 * @param  {array} source the source categories
	 * @param  {array} target convert into target object.
	 */
	_convertCategories: function (source, target) {
		var result = target || [];
		if (enyo.isArray(source)){
			for (var i = 0; i < source.length; i++) {
				var item = source[i];
				var convertItem = {
					categoryId: item.id,
					categoryKey: item.key,
					categoryName: item.name,
					expanded: item.expanded || false,
					childs: []
				};
				result.push(convertItem);
				// loop child source.
				if (item.childs) {
					this._convertCategories(item.childs, convertItem.childs);
				}
			};
		}
	}
});	