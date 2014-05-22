(function (enyo) {
	enyo.setPath("Master.models.CategoryDTOSupport",{
		name: "Master.models.CategoryDTOSupport",

		sortCategories: function (categories) {
			if(enyo.isArray(categories)){
				categories.sort(function (a, b) {
					return a.displayOrder - b.displayOrder  ; // compitible for ie, chrome firefox.
				});
			}
		},
		/**
		 * for category basic info convert dto.
		 * { 	
		 * 		categoryId: "",
		 * 		categoryName: "",
	 	 * 		categoryKey: "",
		 *    	expanded: false,
		 * 	    childs: []
		 * }
		 * @param  {array} source the categories 
		 * @param  {object} target the target tree rootnode used to save converted data
		 * @return {void}  
		 */
		categoryBasicInfoDTO: function (source, rootNode, stopLoop) { 
			if (enyo.isArray(source)){
				// sort categories.
				this.sortCategories(source);
				for (var i = 0; i < source.length; i++) {
					var item = source[i];
					var convertItem = { 
						id: item._id,
						key: item.key,
						name: item.name,
						tags: item.tags || "",
						displayOrder: item.displayOrder,
						expanded: item.expanded || false,
						parentId: item.parentId,
						targetId: item.parentId,
						targetLevel: -1,
						level: item.level,
						isDisplay: item.isDisplay,
						parent: item.parent || null,
						section: item.section || [],
						description: item.description,
						children: []
					};
					if(convertItem.parent !== null) {
						convertItem.targetLevel = convertItem.parent.level;
					}
					if (!stopLoop || item.isDisplay){
						// set parent child node relatetionship.
						convertItem.parent = rootNode;
						rootNode.children.push(convertItem);
						// loop child source.
						if (item.children && item.children.length) {
							this.categoryBasicInfoDTO(item.children, convertItem, stopLoop);
						}
					}
				}; 
			}
		}
	});
})(enyo);