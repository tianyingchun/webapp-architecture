enyo.kind({
	name: "widgets.dialog.NormalLoginDialog",
	kind: "widgets.dialog.Dialog",
	classes: "normal-login-dialog",
	title: "用户登陆",
	mixins: [
		"Master.ClassSupport"
	],
    events:{
        onConfirm:'',
        onCancel:''
    },
    handlers: {
    	onValidationComplete:"formValidationSubmit"
    },
    contentComponents: [
        {name:"close", tag:"button", classes:"close", ontap:"closeDialog", content:"×"},
		{name: "spinner", size:"small", classes:"iframe-spinner", showing: false, kind:"widgets.base.SpinnerBlock", message:"authenticating..."},
        {name:"simpletab", kind:"widgets.custom.SimpleTabs", classes:"header-container", headerComponents: [
        	{content:"用户登陆"},
        	{content:"用户注册"}
        ], contentComponents:[
			{formType:"login", submitButtonStyles:"btn btn-primary",submitButtonText:"登陆", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{classes:"form-item", components:[
						{ classes:"title", content:"用户名: "},
						{ name:"login_username", placeholder:"user name", kind:"widgets.forms.InputDecorator", tipMessage:"用户名称必须填写！", validation: {required:"必填字段！"}}
					]},
					// document name.
					{classes:"form-item", components:[
						{ classes:"title", content:"用户密码: "},
						{ name:"login_password", placeholder:"password", kind:"widgets.forms.InputDecorator", tipMessage:"用户密码必须填写！", validation: {required:"必填字段！"}}
					]}
				]}
			]},
        	{formType:"register", submitButtonStyles:"btn btn-primary",submitButtonText:"去注册", kind:"widgets.forms.FormDecorator", components: [
				{kind:"onyx.Groupbox", components: [
					{classes:"form-item", components:[
						{ classes:"title", content:"用户名: "},
						{ name:"reg_username", placeholder:"user name", kind:"widgets.forms.InputDecorator", tipMessage:"用户名称必须填写！", validation: {required:"必填字段！"}}
					]},
					// document name.
					{classes:"form-item", components:[
						{ classes:"title", content:"用户密码: "},
						{ name:"reg_password", placeholder:"password", kind:"widgets.forms.InputDecorator", tipMessage:"用户密码必须填写！", validation: {required:"必填字段！"}}
					]}
				]}
			]}
        ]}
    ],
    create: enyo.inherit(function(sup){
        return function () {
            sup.apply(this, arguments);
            this.init();    
        }
    }),
    init: function () {
        //do something..
    },
    showingChanged: enyo.inherit(function (sup) {
        return function () {
            sup.apply(this, arguments);
            this.reflowDialogUI();
        };
    }),
    closeDialog: function () {
        this.hide();
        return true;
    },
    //*@public
    setActiveIndex: function(index) {
    	this.$.simpletab.setActiveIndex(index);
    },
    reflowDialogUI: function () {
        this.applyStyle("margin-left", -(this.getBounds().width/2)+"px");
        this.applyStyle("margin-top", -(this.getBounds().height/2)+"px");
    },
	formValidationSubmit: function (inSender, inEvent) {
		var validationResult = inEvent;
		var $originator = inEvent.originator;
		var formType = $originator.formType;
		this.zLog("form validation result", validationResult);
		// success/failed.
		if (validationResult.status =="success") {
			if(formType == "login") {
				var userInfo = {
				 	username: this.$.simpletab.findControlByName("login_username").getValue(),
				 	password: this.$.simpletab.findControlByName("login_password").getValue()
				};
				this.authenticating(userInfo);
			} else if (formType =="register") {
				var newUser = {
				 	username: this.$.simpletab.findControlByName("reg_username").getValue(),
				 	password: this.$.simpletab.findControlByName("reg_password").getValue()
				};
				this.registerNewUser(newUser);
			}
		}
		// stop  bubble.
		return true;
	},
	authenticating: function (user) {
		this.zLog("user",user);
		this.$.spinner.show();
	},
	registerNewUser: function (newUser) {
		this.zLog("new user: ", newUser);
	}
});

