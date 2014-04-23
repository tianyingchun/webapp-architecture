enyo.kind({
	name: "Master.models.apipool.CategoryItem",
	kind: "Master.Model",
	mixins:[
		"Master.models.CategoryDTOSupport"
	],
	// api configrations for specific category item.
	apis: {
		// apiKey: categoryInfo
		categoryInfo: {
			url: "/category/query",
			headers: { Authorization: "" }, 
			cache: {
				enabled: true,
				cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
			},
			dto: "categoryDetailDTO"
		},
		addCategoryInfo: {
			url: "/category",
			cache: false,
			dto: "categoryDetailDTO"
		},
		// update. add new.
		updateCategoryInfo: {
			url: function () {
				return "/category/"+this.get("categoryId");
			},
			cache: false,
			dto: "categoryDetailDTO"
		},
		// destroy
		destroyCategory:{
			url: function () {
				return "/category/"+this.get("categoryId");
			},
			cache: false
		}
	},
	// for model, defined record schema.
	attributes: {
		// categoroy basic information.
		categoryId: "",
		categoryName: "",
		categoryKey: "",
		isExpanded: false,
		isDisplay: true,
		displayOrder: 0,
		isCategoryNode: true,//
		description:"",
		childs: []
	},
	// define primary key.
	primaryKey: "categoryKey",

	//@override the to JSON, it will used to commit new data to server.
	toJSON: function () {
		var _data  = {
			key: this.get("categoryKey"),
			name: this.get("categoryName"),
			expanded:this.get("isExpanded"),
			isDisplay: this.get("isDisplay"),
			displayOrder: this.get("displayOrder"),
			description: this.get("description")
		};
		return enyo.json.stringify(_data);
	},
	/**
	 * Get category details for an specific category.
	 * @param {number} categroyId specific category id.
	 * @param  {function} fn the callback function for api doc categories.
	 * @return {void}
	 */
	getCategoryDetail: function (categoryKey, fn) {
		fn = fn || enyo.nop;
		this.fetch({
			apiKey: "categoryInfo",
			data: { key: categoryKey },
			callback: fn
		});
	},
	/**
	 * Update category info
	 * @param  {category}   category category data.
	 */
	updateCategoryInfo: function (category, fn) {
		// force do post request.
		this.setObject(category);
		this.commit({
			apiKey: "updateCategoryInfo",
			method: "PUT",// 'POST','PUT'
			callback: fn
		});
	},
	// add new category.
	addNewCategory: function (category, fn) {
		this.setObject(category);
		// force do post request.
		this.commit({
			apiKey: "addCategoryInfo",
			method: "POST",// 'POST'
			callback: fn
		});
	},
	// remove category 
	removeCategory: function(categoryId, fn) {
		this.set("categoryId", categoryId);
		this.destroy({
			apiKey: "destroyCategory",
			callback: fn
		});
	},
	/**
	 * API DTO
	 * Get category item info, we can fetch all detail information for current category item.
	 */
	categoryDetailDTO: function (data) {
		var basic = data && enyo.isArray(data) ? data : [data];
		var tempBasicResult = [], result = {};
		this.categoryBasicInfoDTO(basic, tempBasicResult, 0);		
		enyo.mixin(result, tempBasicResult[0]);
		result.description = basic[0].description;
		this.zLog("converted data: ", result);
		return result;
	}
});	