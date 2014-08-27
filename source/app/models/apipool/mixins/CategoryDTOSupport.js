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
						id: item.Id,
						key: item.Key,
						name: item.Name,
						tags: item.Tags || "",
						displayOrder: item.DisplayOrder,
						expanded: item.IsExpanded || false,
						parentId: item.ParentId,
						targetId: item.ParentId,
						targetLevel: -1,
						level: item.Level,
						isDisplay: item.IsDisplay,
						parent: item.Parent || null,
						section: item.Section || [],
						description: item.Description,
						children: []
					};
					if(convertItem.parent !== null) {
						convertItem.targetLevel = convertItem.parent.level;
					}
					if (!stopLoop || item.IsDisplay){
						// set parent child node relatetionship.
						convertItem.parent = rootNode;
						rootNode.children.push(convertItem);
						// loop child source.
						if (item.Children && item.Children.length) {
							this.categoryBasicInfoDTO(item.Children, convertItem, stopLoop);
						}
					}
				}; 
			}
		}
	});
})(enyo);