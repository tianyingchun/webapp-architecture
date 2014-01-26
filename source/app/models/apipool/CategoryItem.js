enyo.kind({
	name: "Master.models.apipool.CategoryItem",
	kind: "Master.Model",
	mixins:[
		"Master.models.CategoryDTOSupport"
	],
	model: "Master.models.apipool.ApiItem",
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
		// update. add new.
		updateCategoryInfo: {
			url: "/category",
			cache: false,
			dto: "categoryDetailDTO"
		},
		// destroy
		destroyCategory:{
			url:"/category",
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
	// primaryKey: "categoryKey",

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
		// var exist = this.store.findLocal(this.kindName, {categoryKey: categoryKey});
		// if(enyo.isArray(exist) && exist.length){
		// 	fn(exist[0]);
		// } else if(enyo.isObject(exist)){
		// 	fn(exist);
		// } else {
		this.fetch({
			apiKey: "categoryInfo",
			data: { key: categoryKey },
			callback: fn
		});
		// }
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
			headers: { Authorization: Master.config.defaultToken },
			method: "PUT",// 'POST','PUT'
			url: "/category/"+category.categoryId,
			callback: fn
		});
	},
	// add new category.
	addNewCategory: function (category, fn) {
		this.setObject(category);
		// force do post request.
		this.commit({
			apiKey: "updateCategoryInfo",
			headers: { Authorization: Master.config.defaultToken },
			method: "POST",// 'POST'
			callback: fn
		});
	},
	// remove category 
	removeCategory: function(categoryId, fn) {
		this.destroy({
			apiKey: "destroyCategory",
			headers: { Authorization: Master.config.defaultToken },
			url: "/category/"+categoryId,
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