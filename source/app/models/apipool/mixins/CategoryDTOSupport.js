(function (enyo) {
	enyo.setPath("Master.models.CategoryDTOSupport",{
		name: "Master.models.CategoryDTOSupport",
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
		 * @param  {array} target the target array used to save converted data
		 * @return {void}  
		 */
		categoryBasicInfoDTO: function (source, target) {
			var result = target || [];
			if (enyo.isArray(source)){
				for (var i = 0; i < source.length; i++) {
					var item = source[i];
					var convertItem = { 
						id: item._id,
						key: item.key,
						name: item.name,
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
					result.push(convertItem);
					// loop child source.
					if (item.children && item.children.length) {
						this.categoryBasicInfoDTO(item.children, convertItem.children);
					}
				};
			}
		}
	});
})(enyo);