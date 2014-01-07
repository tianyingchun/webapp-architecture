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
						categoryId: item.id,
						categoryKey: item.key,
						categoryName: item.name,
						expanded: item.expanded || false,
						childs: []
					};
					result.push(convertItem);
					// loop child source.
					if (item.childs && item.childs.length) {
						this.categoryBasicInfoDTO(item.childs, convertItem.childs);
					}
				};
			}
		}
	});
})(enyo);