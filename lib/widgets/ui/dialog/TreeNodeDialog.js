enyo.kind({
    name: "widgets.dialog.TreeNodeDialog",
    kind: "widgets.dialog.Dialog",
    classes: "dialog-treenodedialog",
    mixins: [
    	"Master.ClassSupport"
    ],
    headerComponents: [
        {name:"headerTitle", classes:"header-title"},
        {name:"close", tag:"button", classes:"close", ontap:"closeDialog", content:"×"}
    ],
    contentComponents: [
        {name:"message",kind:"widgets.base.Spinner", message: "Loading..."},
        {name:"scroller", kind: "Scroller", showing: false, classes: "scroller-sample-scroller enyo-fit", style:"height: 220px", components: [
			{name:"tree",kind:"widgets.menus.TreeMenu"}
		]}
    ],
    footerComponents: [
        { name: "cancel", kind: "onyx.Button", classes:"cancel", ontap: "wasCancelled",  content: this.cancelText},
        { name: "confirm", kind: "onyx.Button", classes:"confirm", ontap: "wasConfirmed",  content: this.confirmText},
        { name: "selecteItemText", classes:"treenode-selected", tag:"span"}
    ],
    published:{
    	success: enyo.nop,
        source: [],
		childNodeKey: "childs",
		selectedItemKey: "hash",
		//normally it's current location hash.
		selectedItemValue: "",
		itemConverter: null
    },
    handlers: {
    	onItemClick:"menuItemTap"
    },
    create: enyo.inherit(function(sup){
        return function () {
            sup.apply(this, arguments);
            this.init();
        }
    }), 
    showingChanged: enyo.inherit(function (sup) {
        return function () {
            sup.apply(this, arguments);
            this.reflowDialogUI();
        };
    }),
    init: function () {
		// for testing purpose end.
		this.$.tree.set("childNodeKey", this.childNodeKey);
		this.$.tree.set("selectedItemKey", this.selectedItemKey);
		this.$.tree.set("selectedItemValue", this.selectedItemValue);
        this.$.tree.set("itemConverter", this.itemConverter);

        this.$.headerTitle.setContent(this.title);
        this.$.cancel.setContent("取消");
        this.$.confirm.setContent("确认");
        // if have initial data, direct show it.
        if (this.source && this.source.length) {
            this.sourceChanged();
        }
    }, 
    //*protected while re-update the source for tree menu, it will auto hide spinner.
    sourceChanged: function () {
        this.$.tree.set("source", this.source);
        this.$.scroller.show();
        this.$.message.hide();
    },
    //*@public show loading status for treenode dialog.
    showLoadingStatus: function () {
        this.$.message.show();
        this.$.scroller.hide();
    },
    closeDialog: function () {
        this.hide();
        return true;
    },
    wasConfirmed: function(inSender, inEvent) {
        this.log("widget.dialog.confirm");
        if(this.success) {
        	var inEvent = {
        		selectedNode: this.selectedNode
        	};
            this.success(inEvent);
        }
        this.hide(); 
    },
    wasCancelled: function(inSender, inEvent) {
        this.log("widget.dialog.cancel");
        this.hide();
        return true;
    },
    menuItemTap: function(inSender, inEvent) {
    	this.selectedNode = inEvent;
    	this.$.selecteItemText.setContent(inEvent.get("content"));
    	return true;
    },
    reflowDialogUI: function () {
        this.applyStyle("margin-left", -(this.getBounds().width/2)+"px");
        this.applyStyle("margin-top", -(this.getBounds().height/2)+"px");
    }
});