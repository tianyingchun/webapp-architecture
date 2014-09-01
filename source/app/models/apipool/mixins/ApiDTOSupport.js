(function(enyo) {
    enyo.setPath("Master.models.ApiDTOSupport", {
        name: "Master.models.ApiDTOSupport",
        /**
         * for category basic info convert dto.
         * @param  {array} source the categories
         * @param  {array} target the target array used to save converted data
         * @param {boolean} stopLoop if we specific stopLooop == true, will not show the api if isDisplay == false
         * @return {void}
         */
        apiBasicInfoDTO: function(source, target, stopLoop) {
            var result = target || [];
            if (enyo.isArray(source)) {
                for (var i = 0; i < source.length; i++) {
                    var item = source[i];
                    var apiItem = {
                        id: item.Id,
                        key: item.Key,
                        name: item.Name,
                        tags: item.Tags || "",
                        displayOrder: item.DisplayOrder,
                        isExpanded: item.IsExpanded || false,
                        parentId: item.ParentId,
                        targetId: item.ParentId,
                        level: item.Level,
                        targetLevel: -1,
                        isDisplay: item.IsDisplay,
                        parent: item.Parent || null,
                        section: item.Section || [],
                        description: item.Description,
                        children: []
                    };
                    if (apiItem.parent !== null) {
                        apiItem.targetLevel = apiItem.parent.level;
                    }
                    if (!stopLoop || apiItem.IsDisplay) {
                        result.push(apiItem);
                        // loop child source.
                        if (item.Children && item.Children.length) {
                            this.apiBasicInfoDTO(item.Children, apiItem.children);
                        }
                    }
                };
            }
        }
    });
})(enyo);
