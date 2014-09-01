/**
 * controllers namespace start Master.controllers.ApiController
 * directory structure related path view app.controllers.
 */
enyo.kind({
    name: "Master.controllers.ApiController",
    kind: "Master.Controller",
    // set up default language for current api document.
    defaultLanguage: Master.config.defaultAPILanguage,

    constants: {
        // detial view kind name.
        API_DETAIL_PAGE: "api.Detail",
        API_LIST_SEARCH: "api.Search"
    },
    handlers: {
        onSearchPagedChanged: "searchPagedChangedHandler"
    },
    mixins: [
        //Note we have bindinged view and controller mapping for leftdock view. so 
        //if we need to render main content we need use event bubble to update.
        "Master.controllers.DockSupport"
    ],
    // default action :/node/api
    index: function(apiKey) {
        this.zLog("apiKey: ", apiKey);
        // show left dock categories.
        this.detail(apiKey, null);
    },
    /**
     * Action: node,
     * mapping: { "path": "node/:key", "controller": "ApiController", "action": "detail"},
     */
    detail: function(apiKey) {
        this.zLog("apiKey: ", apiKey);
        //save current user selected language.
        // this.saveUserApiLanguage(language);
        var configData = {
            parentId: 0,
            level: 0,
            apiKey: apiKey
        };
        // fetch api details information here.
        this.fetchApiDetailInfo(apiKey);
    },
    /**
     * action: searxh
     * @param  {string} params object string {text:"tag", type:'api'}
     * mapping: { "path": "search/:params", "controller": "ApiController", "action": "search"},
     */
    search: function(params) {
        params = decodeURIComponent(params);
        var query = null;
        try {
            query = enyo.json.parse(params);
        } catch (err) {
            query = {
                text: ""
            };
            this.zError(err);
        }
        this.zLog("query : ", query);
        Master.view.frame.setSearchInputTxt(query.text);
        // show all dock categoryes.
        this.getCategorySiblingsAndChilds({
            parentId: 0,
            level: 0
        });
        // search doc list..
        this.searchApis(query);
    },
    searchApis: function(query, pageIndex, pageSize) {
        var pageSize = pageSize || 10,
            pageIndex = pageIndex || 1;
        this.bindingViewToContent(this.API_LIST_SEARCH, null, null);
        // fetch search data from server.
        var apiItem = this.getModelInstance("Master.models.apipool.ApiItem", {
            id: "searchlist"
        });
        // preload all sitemap navigator tree source. and cache it.
        apiItem.searchApis(query.text, pageIndex, pageSize, this.bind("showApiListUI", query, pageIndex, pageSize));
    },
    searchPagedChangedHandler: function(inSender, inEvent) {
        var query = inEvent.query;
        var pageIndex = inEvent.pageIndex;
        var pageSize = inEvent.pageSize;
        this.searchApis(query, pageIndex, pageSize);
    },
    showApiListUI: function(query, pageIndex, pageSize, viewModel) {
        this.notifyView(this.API_LIST_SEARCH, viewModel, {
            action: "showApiListUI",
            data: {
                pageIndex: pageIndex,
                pageSize: pageSize,
                query: query
            }
        });
    },
    fetchApiDetailInfo: function(apiKey) {
        // binding view,
        this.bindingViewToContent(this.API_DETAIL_PAGE, null, null);
        // view data.
        var viewData = {
            action: "showApiDetailUI",
            data: {
                apiKey: apiKey
            }
        };
        // use cached  model instance here avoid create multiple modle instance and cached within enyo.store __global__
        var apiItemModel = this.getModelInstance("Master.models.apipool.ApiItem", {
            key: apiKey
        });
        if (apiItemModel.isNew) {
            apiItemModel.getApiDetailByKey(apiKey, this.bind("_showApiDetailInfo", viewData));
        } else {
        	// fetch api item isntance view model from memory cache.
            this._showApiDetailInfo(viewData, apiItemModel);
        }
    },
    _showApiDetailInfo: function(viewData, viewModel) {
        this.showDockCategories(viewModel);
        // this.zLog("categoryDetail: ", viewData, viewModel);
        this.notifyView(this.API_DETAIL_PAGE, viewModel, viewData);
    },
    //@* public show categories on left dock
    showDockCategories: function(viewModel) {
        var currLevel = viewModel.get("level");
        var configData = {
            parentId: viewModel.get("parentId") || 0,
            level: parseInt(currLevel) - 1,
            stopLoop: true
        };
        // if current api has children api show current and it's child api list
        // else show it's parent and parent silbings and childs.
        var children = viewModel.get("children");
        if (children && children.length) {
            configData.parentId = viewModel.get("id");
            configData.level++;
        }
        // if fromLevel equals -1 correct it.
        if (!!!~configData.level) {
            configData.level = 0;
            configData.parentId = 0;
        }
        this.zLog("category list Levels: ", configData);

        if (!Master.view.frame.hasCategoryContentsIndock() || this.ifRefreshDockCategories(configData)) {
            // maybe async fetch data here.
            this.getCategorySiblingsAndChilds(configData);
        } else {
            //todo maybe need to update the hight menu item here
            enyo.Signals.send("onMenuAccrodionUpdate");
        }
        // while api detail have loaded, then update navigator tree.
        this.getAllCategoriesTreeData({
            id: viewModel.get("id"),
            key: viewModel.get("key"),
            name: viewModel.get("name")
        });
    },
    // *@private indicates if we need to refresh left dock categories.
    ifRefreshDockCategories: function(configData) {
        var lastedDockLevelConfig = Master.view.frame.getCurrentCategoryDockConfig() || {
            parentId: 0,
            level: 0
        };
        if (lastedDockLevelConfig.level == configData.level) {
            return false;
        }
        return true;
    }
});
