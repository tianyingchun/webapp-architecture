enyo.kind({
	name: "widgets.dialog.SpinnerDialog",
	kind: "onyx.Popup", 
	classes: "dialog-spinner", 
	scrim: true,
    centered: true,
    floating: true,
    autoDismiss: false,
    allowHtml: true,
    modal: true,
    published: {
        message: "Loading...",
        size: 30
    },
    components: [
        {name:"spinner",classes:"image"},
        {name:"message", classes: "message"}
    ],
    create: enyo.inherit(function (sup) {
        return function () {
            sup.apply(this, arguments);
            this.messageChanged();
        };  
    }),
    sizeChanged: function (oldValue) {
        var sizeClass = this.getSizeClass(this.size);
        this.$.spinner.addClass(sizeClass);
    },
    messageChanged: function (oldValue) {
        var sizeClass = this.getSizeClass(this.size);
        this.$.message.addClass(sizeClass);
        this.$.message.setContent(this.message);
    },
    getSizeClass: function (size) {
        return "size-"+size;
    },
    hide:enyo.inherit(function (sup) {
        return function () {
            sup.apply(this, arguments);
            // make sure destroy current dialog instance.
            this.destroy();
        };
    })
});