/**
 * @class  ConfirmDialog.
 */
enyo.kind({
    name: "widgets.dialog.ConfirmDialog",
    kind: "widgets.dialog.Dialog",
    classes: "dialog-confirm",
    published: { 
        confirmText: "Yes",
        cancelText: "Cancel",
        success:enyo.nop,
        failure:enyo.nop
    },
    events:{
        onConfirm:'',
        onCancel:''
    },
    footerComponents: [
        { name: "cancel", kind: "onyx.Button", classes:"cancel", ontap: "wasCancelled",  content: this.cancelText},
        { name: "confirm", kind: "onyx.Button", classes:"confirm", ontap: "wasConfirmed",  content: this.confirmText}
    ],
    create: enyo.inherit(function(sup){
        return function () {
            sup.apply(this, arguments);
            this.confirmTextChanged();
            this.cancelTextChanged();
        }
    }),
    showingChanged: enyo.inherit(function (sup) {
        return function () {
            sup.apply(this, arguments);
            // console.log(this.getBounds())
            this.applyStyle("margin-left", -(this.getBounds().width/2)+"px");
        };
    }),
    cancelTextChanged: function(oldCancelText) {
        this.$.cancel.setContent(this.cancelText);
    },
    confirmTextChanged: function(oldConfirmText) {
        this.$.confirm.setContent(this.confirmText);
    },
    wasConfirmed: function(inSender, inEvent) {
        this.log("widget.dialog.confirm");
        this.doConfirm(); 
        if(this.success) {
            this.success();
        }
        this.hide(); 
    },
    wasCancelled: function(inSender, inEvent) {
        this.log("widget.dialog.cancel");
        this.doCancel();

        if(this.failure) {
            this.failure();
        }
        this.hide();
    }   
});