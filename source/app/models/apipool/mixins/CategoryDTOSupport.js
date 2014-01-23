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
		categoryBasicInfoDTO: function (source, target,level) {
			level++;
			var result = target || [];
			if (enyo.isArray(source)){
				for (var i = 0; i < source.length; i++) {
					var item = source[i];
					var convertItem = {
						categoryId: item._id,
						categoryKey: item.key,
						categoryName: item.name,
						displayOrder: item.displayOrder,
						isExpanded: item.expanded || false,
						isDisplay: typeof(item.isDisplay) == "undefined" ? true: item.isDisplay,
						isCategoryNode: level == 1,
						childs: []
					};
					result.push(convertItem);
					// loop child source.
					if (item.apis && item.apis.length) {
						this.categoryBasicInfoDTO(item.apis, convertItem.childs, item.level);
					}
				};
			}
		}
	});
})(enyo);