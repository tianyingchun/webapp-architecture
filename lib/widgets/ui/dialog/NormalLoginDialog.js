enyo.kind({
	name: "widgets.dialog.NormalLoginDialog",
	kind: "widgets.dialog.Dialog",
	classes: "normal-login-dialog",
	title: "用户登陆",
	published: { 
        confirmText: "登陆",
        cancelText: "取消"
    },
    events:{
        onConfirm:'',
        onCancel:''
    },
    contentComponents: [
		{name: "spinner",classes:"iframe-spinner", kind:"widgets.base.SpinnerBlock", message:"initializing..."},
        {name:"simpletab", kind:"widgets.custom.SimpleTabs", classes:"header-container", headerComponents: [
        	{content:"用户登陆"},
        	{content:"用户注册"}
        ], contentComponents:[
			{content:"用户登陆"},
        	{content:"用户注册"}
        ]}
    ],
    footerComponents: [
        { name: "cancel", kind: "onyx.Button", classes:"btn btn-primary btn-small cancel", ontap: "wasCancelled",  content: this.cancelText},
        { name: "confirm", kind: "onyx.Button", classes:"btn btn-danger btn-small confirm", ontap: "wasConfirmed",  content: this.confirmText}
    ],
    create: enyo.inherit(function(sup){
        return function () {
            sup.apply(this, arguments);
            this.init();    
        }
    }),
    init: function () {
        this.$.cancel.setContent(this.cancelText);
        this.$.confirm.setContent(this.confirmText);
    },
    showingChanged: enyo.inherit(function (sup) {
        return function () {
            sup.apply(this, arguments);
            this.reflowDialogUI();
        };
    }),
    //*@public
    setActiveIndex: function(index) {
    	this.$.simpletab.setActiveIndex(index);
    },
    reflowDialogUI: function () {
        this.applyStyle("margin-left", -(this.getBounds().width/2)+"px");
        this.applyStyle("margin-top", -(this.getBounds().height/2)+"px");
    },
    wasConfirmed: function(inSender, inEvent) {
        this.log("widget.dialog.confirm");
        this.doConfirm(); 
        // this.hide(); 
        return true;
    },
    wasCancelled: function(inSender, inEvent) {
        this.log("widget.dialog.cancel");
        this.doCancel();
        this.hide();
        return true;
    }  
});

