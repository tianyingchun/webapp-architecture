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
						id: item._id,// 不能用id.因为ENYO 里面组件查找是通过ID 来的容易照成冲突 非常重要。 所以在使用组建的时候一定不能用Id
						key: item.key,
						name: item.name,
						displayOrder: item.displayOrder,
						expanded: item.expanded || false,
						isDisplay: typeof(item.isDisplay) == "undefined" ? true: item.isDisplay,
						children: []
					};
					result.push(convertItem);
					// loop child source.
					if (item.children && item.children.length) {
						this.categoryBasicInfoDTO(item.children, convertItem.children, item.level);
					}
				};
			}
		}
	});
})(enyo);