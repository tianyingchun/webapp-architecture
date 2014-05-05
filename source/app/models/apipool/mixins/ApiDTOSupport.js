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
						displayOrder: item.displayOrder,
						parentId: item.parentId,
						isDisplay: item.isDisplay,
						description: item.description
					};
					result.push(apiItem);
				};
			}
		}
	});
})(enyo);