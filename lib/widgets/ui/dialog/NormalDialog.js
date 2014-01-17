enyo.kind({
    name: "widgets.dialog.NormalDialog",
    kind: "widgets.dialog.Dialog",
    classes: "dialog-normal",
    headerComponents: [
        {name:"headerTitle", classes:"header-title"},
        {name:"close", tag:"button", classes:"close", ontap:"closeDialog", content:"×"}
    ],
    contentComponents: [
        { name: "container", allowHtml:true, tag: "div", content: ""}
    ],
    published:{
        htmlContent: ""
    },
    htmlContentChanged: function (oldHtml) {
        this.$.container.setContent(this.htmlContent);
    },
    titleChanged: function (oldTitle) {
        this.$.headerTitle.setContent(this.title);
    },
    closeDialog: function () {
        this.hide();
        return true;
    }
});