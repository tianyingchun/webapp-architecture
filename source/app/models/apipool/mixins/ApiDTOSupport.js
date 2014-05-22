(function (enyo) {
	enyo.setPath("Master.models.ApiDTOSupport",{
		name: "Master.models.ApiDTOSupport",
		/**
		 * for category basic info convert dto.
		 * @param  {array} source the categories 
		 * @param  {array} target the target array used to save converted data
		 * @return {void}  
		 */
		apiBasicInfoDTO: function (source, target) {
			var result = target || [];
			if (enyo.isArray(source)){
				for (var i = 0; i < source.length; i++) {
					var item = source[i];
					var apiItem = {
						id: item._id,
						key: item.key,
						name: item.name,
						tags: item.tags || "",
						displayOrder: item.displayOrder,
						expanded: item.expanded || false,
						parentId: item.parentId,
						targetId:  item.parentId,
						level: item.level,
						targetLevel: -1,
						isDisplay: item.isDisplay,
						parent: item.parent || null,
						section: item.section || [],
						description: item.description,
						children: []
					};
					if(apiItem.parent !== null) {
						apiItem.targetLevel = apiItem.parent.level;
					}
					result.push(apiItem);
					// loop child source.
					if (item.children && item.children.length) {
						this.apiBasicInfoDTO(item.children, apiItem.children);
					}
				};
			}
		}
	});
})(enyo);