enyo.kind({
	name: "Master.models.apipool.Categories",
	kind: "Master.Collection",
	mixins:[
		"Master.models.CategoryDTOSupport"
	],
	model: "Master.models.apipool.ApiItem",
	// api configrations for api categories.
	apis: {
		allcategories: {
			url: "/apis",
			// cache: {
			// 	enabled: true,
			// 	cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
			// },
			dto: "apiCategoriesDataDTO"
		},
		categorySiblings:{
			url: function(){
				return "/sibling/{parentId}";
			},
			dto: "apiCategoriesDataDTO"
		}
	},
	// default we don't need to instance all records as specificed model. 
	instanceAllRecords: false,

	/**
	 * Get all api doc categories.
	 * @param  {function} fn the callback function for api doc categories.
	 * @param {bool} stopLoop for end user if set isDisplay: false, will don't show it and it's childs.
	 * @return {void}
	 */
	getApiCategories: function (fn, fromLevel, toLevel, stopLoop) {
		stopLoop = stopLoop || false;
		fromLevel = fromLevel || 0;
		toLevel = toLevel || 20;
		this.fetch({
			apiKey: "allcategories",
			url: function () {
				return "/apis/"+fromLevel+"/"+toLevel;
			},
			stopLoop: stopLoop,
			callback: fn
		});
	},
	/**
	 * Get all siblings node and it's first level childs.
	 * @param  {callback} fn 
	 * @return {}
	 */
	getCategorySiblings: function (fn, parentId, level, stopLoop) {
		stopLoop = stopLoop || false;

		// for root level childs use getApiCategories api.
		if (parentId == "0" || level == 0){
			this.getApiCategories(fn, 0, 1, stopLoop);
		} else { 
			this.fetch({
				apiKey: "categorySiblings",
				url: function(){
					return "/sibling/"+parentId;
				},
				stopLoop: stopLoop,
				callback: fn
			});
		}
	},
	/**
	 * Convert category list data
	 * @param  {object} data category data, it should be array, also can be another object.
	 */
	apiCategoriesDataDTO: function (data, options) {
		var stopLoop = options.stopLoop || false;
		data = data && enyo.isArray(data) ? data : [];
		// define root node.
		var rootNode = {
			parent: null,
			parentId: 0,
			children: [],
			id: 0,
			level: -1,
			name:"Home",
			key:"home"
		};
		// convert source data and saved into result.
		this.categoryBasicInfoDTO(data, rootNode, stopLoop);
		
		this.zLog("converted category tree: ", rootNode);
		
		return rootNode.children;
	}
});	