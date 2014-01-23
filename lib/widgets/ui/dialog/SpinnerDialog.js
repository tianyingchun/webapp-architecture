enyo.kind({
	name: "widgets.dialog.SpinnerDialog",
	kind: "onyx.Popup", 
	classes: "dialog-spinner", 
	scrim: true,
    centered: true,
    autoDismiss: false,
    allowHtml: true,
    floating: true,
    modal: true,
    published: {
        message: "Loading...",
        size: 30 // default size 30
    },
    components: [
        {name:"spinner", kind:"onyx.Spinner"},
        {name:"message", classes: "message"}
    ],
    create: enyo.inherit(function (sup) {
        return function () {
            this._count = 0;
            this._messages = [];// {uid: message}

            sup.apply(this, arguments);
            this.messageChanged();
        };  
    }),
    sizeChanged: function (oldValue) {
        var sizeClass = this.getSizeClass(this.size);
        this.$.spinner.addClass(sizeClass);
    },
    messageChanged: function (oldValue) {
        this.$.message.setContent(this.message);
    },
    getSizeClass: function (size) {
        return "size-"+size;
    },
    // @* public
    show: enyo.inherit(function (sup) {
        return function (message) {
            sup.apply(this, arguments);
            this._count ++;
            var _uid = this._getUid();
            this._messages.push({
                uid: _uid,
                message: message || this.message
            });
            return _uid;
        };
    }),
    //* @private 
    _removeMessage: function (uid) {
        var find = false;
        var removeIndex = 0;
        for (var i = 0; i < this._messages.length; i++) {
            var item = this._messages[i];
            if(item.uid == uid){
                find = true;
                removeIndex = i;
                break;
            }
        };
        // fond, remove it
        if (find) {
            this._messages.splice(removeIndex, 1);
        }
        return find;
    },
    //@private available uid flag unique id.
    _getUid: function () {
        return enyo.uid("alert_spinner_");
    },
    hide:enyo.inherit(function (sup) {
        return function (uid) {
            var _find = this._removeMessage(uid);
            if (_find) {
                this._count--;
                // show old message.
                this.message = this._messages.length && this._messages[0].message;
                this.messageChanged();
                this.log("_messages: ", this._messages);
            } else {
                this.warn("can't find spinner message!: "+ uid);
            }
            if (this._count <= 0) {
                // do hides controls.
                sup.apply(this, arguments);
                // make sure destroy current dialog instance.
                this.destroy();
                // has destroyed current spiner dialog.
                return true;
            }
            return false;
        };
    })
});