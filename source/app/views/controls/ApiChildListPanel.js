enyo.kind({
    name: "Master.views.controls.ApiChildListPanel",
    classes: "api-child-list",
    mixins: [
        "Master.ClassSupport",
        "Master.HistorySupport"
    ],
    events: {
        "onDeleteApiItem": ""
    },
    handlers: {
        "onActionButtonTap": "rowActionButtonTap"
    },
    published: {
        parentId: null,
        source: [],
        pageIndex: 1,
        recordsTotal: 0,
        pagerUri: ""
    },
    components: [{
        kind: "onyx.Groupbox",
        name: "listWrapper",
        components: [{
            classes: "list-header",
            components: [{
                content: "文档列表",
                classes: "list-title"
            }, {
                tag: "a",
                classes: "btn",
                ontap: "addNewApi",
                components: [{
                    tag: "i",
                    classes: "icon-plus"
                }, {
                    tag: "span",
                    content: "添加"
                }]
            }]
        }, {
            name: "docList",
            showPager: false,
            kind: "widgets.lists.PagedTableRowsList",
            rowKeyField: "id",
            fields: ['id', 'name', 'key'],
            header: ['文档ID', '文档名称', '文档Hash', '操作']
        }]
    }],
    sourceChanged: function() {
        this.$.docList.set("source", this.source);
    },
    pageIndexChanged: function() {
        this.$.docList.set("pageIndex", this.pageIndex);
        this.reInitList();
    },
    recordsTotalChanged: function() {
        this.$.docList.set("recordsTotal", this.recordsTotal);
        this.reInitList();
    },
    pagerUriChanged: function() {
        this.$.docList.set("pagerUri", this.pagerUri);
        this.reInitList();
    },
    reInitList: function() {
        this.$.docList.refresh();
    },
    addNewApi: function(inSender, inEvent) {
        this.location("profile/node/new");
        return true;
    },
    confirmDeleteApiItem: function(apiId, apiKey, apiName) {
        Master.view.frame.showConfirmDialog({
            title: "确认",
            message: "确认要删除API'" + apiName + "'吗？",
            success: this.bindSafely("deleteApiItem", apiId, apiKey)
        });
    },
    deleteApiItem: function(apiId, apiKey) {
        this.doDeleteApiItem({
            parentId: this.parentId,
            id: apiId,
            key: apiKey
        });
    },
    //*@private helper.
    findRowItemData: function(apiId) {
        var find = null;
        for (var i = 0; i < this.source.length; i++) {
            var item = this.source[i];
            if (item.id == apiId) {
                find = item;
                break;
            }
        };
        return find;
    },
    //*@action button tap handler.
    rowActionButtonTap: function(inSender, inEvent) {
        var action = inEvent.action;
        var apiId = inEvent.key;
        var location = "";
        var currItem = this.findRowItemData(apiId);
        switch (action) {
            case "add":
                location = "profile/node/new";
                break;
            case "edit":
                location = currItem.children && currItem.children.length ? "profile/node/list/" + currItem.key : "profile/node/" + currItem.key;
                break;
            case "remove":
                this.confirmDeleteApiItem(currItem.id, currItem.key, currItem.name);
                break;
        }
        if (location) {
            this.location(location);
        }
        return true;
    }
})
