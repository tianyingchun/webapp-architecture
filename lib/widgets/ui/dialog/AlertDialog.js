
enyo.kind({
	name: "widgets.dialog.AlertDialog",
	kind: "widgets.dialog.Dialog", 
	classes: "dialog-alert", 
	published: { 
        success: enyo.nop,
        okButtonText:  "Ok"
    },
    events:{
		onConfirm:''
	},
	footerComponents: [
		 { name: "okButtn", kind: "onyx.Button", ontap: "wasConfirmed",  content: this.okButtonText}
	],
    /**
    * @method create
    **/
    create: enyo.inherit(function(sup) {
        return function () {
            sup.apply(this, arguments);
            this.inherited(arguments); 
            this.okButtonTextChanged();
        };
    }), 
    okButtonTextChanged: function (oldOkButtonText) {
    	this.$.okButtn.setContent(this.okButtonText);
    },
    wasConfirmed: function(inSender, inEvent) { 
    	this.log("widget.dialog.alert.wasConfirmed");
    	this.doConfirm();
        if(this.success) {
            this.success();
        }
        this.hide();
    }  
});