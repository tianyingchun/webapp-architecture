enyo.kind({
    name: "Master.models.apipool.ApiItem",
    kind: "Master.Model",
    mixins: [
        "Master.models.ApiDTOSupport"
    ],
    // api configrations for specific category item.
    apis: {
        //for user page
        apiDetailByKey: {
            url: function() {
                return "/doc/get_doc_item_key?dockey=" + this.get("key");
            },
            cache: {
                enabled: true,
                cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
            },
            dto: "apiDetailDTO"
        },
        // for admin page.
        apiDetailById: {
            url: function() {
                return "/doc/get_doc_item_id?docId=" + this.get("id");
            },
            cache: {
                enabled: true,
                cacheTime: 10 * 60 * 1000
            },
            dto: "apiDetailDTO"
        },
        // add new api.
        addNewApi: {
            url: "/doc/create",
            cache: false,
            dto: "apiDetailDTO"
        },
        // update api information.
        updateApiInfo: {
            url: function() {
                return "/doc/update";
            },
            cache: false,
            dto: "apiDetailDTO"
        },
        // remove api 
        destroyApi: {
            url: function() {
                return "/doc/delete?id=" + this.get("id");
            },
            cache: false
        },
        restoreApi: {
            url: function() {
                return "/doc/restore?id=" + this.get("id");
            },
            cache: false
        },
        searchApis: {
            dto: "searchApisDataDTO"
        }
    },
    // it will automatically append the url request if it has value.
    // Note: the enyo.store is global memory model instance managerment
    // we need to maually manager this object.
    primaryKey: "id", //default is "id"
    // api detail default fields. it will be auto instanced.
    attributes: {
        id: "", // global unique, don't use key as primary key because in profile page we can edit the key.
        key: "",
        name: "",
        tags: "",
        parentId: "0",
        targetId: 0,
        targetLevel: -1, // if we move to root level targetLevel == -1
        level: 0,
        parent: null,
        displayOrder: 0,
        isDisplay: true,
        description: "",
        section: [],
        expanded: false,
        children: []
    },
    //*@ private help method for preparing the submit data.
    _getPostInfo: function(apiInfo) {
        var _data = enyo.clone(apiInfo);
        // _data.key = _data.apiKey;
        delete _data.level;
        // _data.name = _data.apiName;
        delete _data.targetLevel;

        return enyo.json.stringify(_data);
    },
    /**
     * Get current api details by api id.
     * @param {number} apiId specific api item id.
     * @param  {function} fn the callback function for api detail information.
     * @return {void}
     */
    getApiDetailByKey: function(key, fn) {
        fn = fn || enyo.nop;
        // cause of the primary key is "id", so for user api detail page , we getModelInstance pass parameter is {id:""}
        // so need to manualy clear exist data while re-fetch data.
        this._clearExitData();
        this.set("key", key);
        this.fetch({
            apiKey: "apiDetailByKey",
            callback: fn
        });
    },
    _clearExitData: function() {
        this.attributes = {
            id: "", // global unique, don't use key as primary key because in profile page we can edit the key.
            key: "",
            name: "",
            tags: "",
            parentId: "0",
            level: 0,
            targetId: 0,
            targetLevel: -1,
            parent: null,
            displayOrder: 0,
            isDisplay: true,
            description: "",
            section: [],
            expanded: false,
            children: []
        };
    },
    getApiDetailById: function(id, fn) {
        fn = fn || enyo.nop;
        this.set("id", id);
        this.fetch({
            apiKey: "apiDetailById",
            callback: fn
        });
    },
    //@public new api details.
    addNewApi: function(apiInfo, fn) {
        this.setObject(apiInfo);
        this.commit({
            apiKey: "addNewApi",
            method: "POST",
            data: this._getPostInfo(apiInfo),
            callback: fn
        });
    },
    //*@ public
    updateApiInfo: function(apiInfo, fn) {
        //only need id, targetId
        //(level, targetLevel)need rechecked from serverside by id, targetid.
        this.setObject(apiInfo);
        this.commit({
            apiKey: "updateApiInfo",
            method: "PUT",
            data: this._getPostInfo(apiInfo),
            callback: fn
        })
    },
    //*@ destroy
    destroyApi: function(apiId, fn) {
        this.set("id", apiId);
        this.destroy({
            apiKey: "destroyApi",
            callback: fn
        })
    },
    searchApis: function(query, pageIndex, pageSize, fn) {
        this.fetch({
            apiKey: "searchApis",
            url: function() {
                return "/doc/search_docs?queryStr=" + query + "&pageNumber=" + pageIndex + "&pageSize=" + pageSize;
            },
            callback: fn
        })
    },
    /**
     * Get category item info, it should be contains all api list for this category.
     */
    apiDetailDTO: function(data) {
        var basic = data && enyo.isArray(data) ? data : [data];
        var tempBasicResult = [],
            result = {};
        this.apiBasicInfoDTO(basic, tempBasicResult);
        enyo.mixin(result, tempBasicResult[0]);
        this.zLog("converted data: ", result);
        return result;
    },
    searchApisDataDTO: function(data, options) {
        var basic = data && data.list || [];
        var tempBasicResult = [];
        this.apiBasicInfoDTO(basic, tempBasicResult);
        //filter API item isDisplay == false 
        var filterCount = 0,
            newResult = [];
        for (var i = 0; i < tempBasicResult.length; i++) {
            var item = tempBasicResult[i];
            if (item.isDisplay === false) {
                filterCount++;
            } else {
                newResult.push(item);
            }
        };
        var newData = {
            total: data.total - filterCount,
            list: newResult
        };
        return newData;
    }
});
