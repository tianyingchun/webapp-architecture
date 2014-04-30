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
        {kind: "Scroller",classes: "scroller-sample-scroller enyo-fit", style:"height: 220px", components: [
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
    	// for testing purpose.
		this.source = [
			{key:"1", content: "Alpha", hash:"#profile/api/list", components: [
				{key:"2",hash:"#profile/api/list", content: "Bravo-Alpha"},
				{key:"3",hash:"#profile/api/list", content: "Bravo-Bravo"},
				{key:"4",hash:"#profile/api/list", content: "Bravo-Charlie"}
			]},
			{ key:"5",content: "Bravo",hash:"#profile/api/list", components: [
				{key:"6",hash:"#profile/api/list", content: "Bravo-Alpha"},
				{key:"7",hash:"#profile/api/list", content: "Bravo-Bravo"},
				{key:"8",hash:"#profile/api/list", content: "Bravo-Charlie"}
			]}
		];
		this.childNodeKey = "components";
		this.selectedItemKey = "key";
		this.selectedItemValue= "4";
		// for testing purpose end.
		this.$.tree.set("childNodeKey", this.childNodeKey);
		this.$.tree.set("selectedItemKey", this.selectedItemKey);
		this.$.tree.set("selectedItemValue", this.selectedItemValue);
		this.$.tree.set("source", this.source);

        this.$.headerTitle.setContent(this.title);
        this.$.cancel.setContent("取消");
        this.$.confirm.setContent("确认");
    }, 
    sourceChanged: function () {
        this.$.tree.set("source", this.source);
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