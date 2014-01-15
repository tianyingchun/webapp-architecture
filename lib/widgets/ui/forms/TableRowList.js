
/**
 * Write new widget tableRowItems that can construct table list dom structure
 * providered nomalize  table row list ui interface and interaction
 * Note. IE don't support setInnerHtml so we don't use enyo create truely table layout now 
 * Use css style display: table, table-cell, table-row to force table render.
 */
enyo.kind({
    name: "widgets.forms.TableRowItems",
    mixins:[
        "Master.ClassSupport"
    ],
    published:{
        // table header items.
        captionText:[],
        // items source for table row components.
        itemsSource: [],
        // set some field items don't display as table cell.
        hideFieldItems: [],
        // allow one filed that don't appear in table column
        keyField: '',
        // allow provider the actions for on tap events.
        actions: [],
        // if always show checkbox 
        showCheckbox: true,
        // internal value used to indicates current row if it has been checked.
        hasChecked: "_hasChecked",
        // allow checkbox as radio button model.
        radioModel: false
    },
    classes:"table-row-list",
    handlers:{
        onchange:"checkboxChanged",
        ontap:"tapHandler"
    },
    events:{
        onCheckboxChange:''
    },
    create: function () {
        this.inherited(arguments);
        this.keyField = this.keyField || "id";
        this.uid = 0;
        // gennerated keyfield.
        this.genneratedKeyFields();

        this.showTableList();
    },
    genneratedKeyFields: function () {
        for (var i = this.itemsSource.length - 1; i >= 0; i--) {
            var item = this.itemsSource[i];
            if (!item[this.keyField]) {
                this.uid ++;
                item[this.keyField] = this.uid;
            }
        };
    },
    tapHandler: function (inSender,inEvent) {
        if(inSender && inSender.tag == "ul") {
            var tappedItem = this.getTappedItem(inSender["keyField"]);
            this.bubble("ontap", enyo.clone(tappedItem));
            return true;
        }
    },

    checkboxChanged: function (inSender, inEvent) { 
        if (inSender.tag =="ul") { 
            // cache current checkbox
            var $currentCheckbox = inEvent.originator;
            // save current item checked status first.
            var isChecked = $currentCheckbox && $currentCheckbox.getValue() ? true: false;  
            // if radio model, remove kast checkbox's check attribute.
            if (this.radioModel && this.$lastCheckbox && this.$lastSender) {
                this.$lastCheckbox.setValue(false);
                // set specific item source to unChecked.
                this.updateItemCheckStatus(this.$lastSender["keyField"], false); 
            } 
            // save last checkbox.
            this.$lastCheckbox = $currentCheckbox;
            this.$lastSender = inSender;
            // if only one checkbox item.
            if (this.$lastCheckbox === $currentCheckbox) {
                $currentCheckbox.setValue(isChecked);
            }
            var tappedItem = this.getTappedItem(inSender["keyField"], isChecked);
        
            this.doCheckboxChange(enyo.clone(tappedItem));
        } 
    },
    /**
     * set status for specific datasource item.
     * @param {string} keyFiledValue
     * @param {bool} status true/ false.
     */
    updateItemCheckStatus: function (keyFiledValue, status) {
        for (var i =0; i<this.itemsSource.length;i++) {
            var item = this.itemsSource[i];
            if(item[this.keyField] == keyFiledValue) {
                item[this.hasChecked] = status;
                return item;
            }
        } 
    },
    /**
     * Find specific item from itemsSource.
     * @param  {string} item value of this key.
     */
    getTappedItem: function (value, isChecked) {
       var item  = this.updateItemCheckStatus(value, isChecked);
       return item || null;
    },
    showTableList: function () {  
        // create table header if exists
        this._createTableHeaderRow(this.captionText);
        // create table rows.
        var len = this.itemsSource.length;
        for (var i = 0; i < len; i++) {
            var rowItem = this.itemsSource[i];
            var classNeme = "item";
            if (i==0) {
                classNeme = "first";
            } else if (i == len - 1){
               classNeme = "last";
            } 
            this._createTrItem(rowItem, classNeme);
        };
        this.render();
    },
    /**
     * get selected items.
     */
    getSelectedItems: function () {
        var selectedItems = [];
        for (var i = this.itemsSource.length - 1; i >= 0; i--) {
            var item = this.itemsSource[i];
            if (item[this.hasChecked]) {
                selectedItems.push(item);
            } else {
                // explicty give false value for this item.
                item[this.hasChecked] = false;
            }
        };
        return selectedItems;
    },
    /**
     * Create header row
     * @param  {array} captionText caption text
     */
    _createTableHeaderRow: function (captionText) {
        var thComponents = [];
        for (var i = 0; i < captionText.length; i++) {
            var caption = captionText[i];
            thComponents.push({ tag:"li",content:caption });
        };
        this.createComponent({ tag:"ul", classes:"header-row", components:thComponents}); 
    },
    /**
     * Create tr row item
     * @param  {object} itemSource the tr row item
     */
    _createTrItem: function (itemSource, className) { 
        var _itemSource = enyo.clone(itemSource); 
        var tdItemComponents = [];
        // if show checkbox here?
        if(this.showCheckbox) {
            tdItemComponents.push({kind:"widgets.forms.table.Cell", controlType:"checkbox", classes: item, value: false});
        }
        for (var item in _itemSource) {
            if(item != this.keyField && this._needShow(item)) { 
                var itemValue = _itemSource[item]; 
                tdItemComponents.push({kind:"widgets.forms.table.Cell", controlType:"text", classes: item, value: itemValue}); 
            }
        }
        // append actions for each row.
        for(var i = 0; i<this.actions.length;i++) {
            tdItemComponents.push({kind:"widgets.forms.table.Cell", controlType:"linkbutton", classes: item, value: this.actions[i]}); 
        }
        this.createComponent({ tag:"ul", classes:className, keyField:_itemSource[this.keyField], components:tdItemComponents}); 
    },
    _needShow: function (item) {
        var needShow = true;
        if (this.hideFieldItems.length) {
            for (var i = this.hideFieldItems.length - 1; i >= 0; i--) {
                var field = this.hideFieldItems[i];
                if (field == item) {
                    needShow = false;
                    break;
                }
            };
        } 
        return needShow;
    }
});
/**
 * Customized table cell
 */
enyo.kind({
    name:"widgets.forms.table.Cell",
    tag: "li",
    published:{
        value: "", 
        controlType: "text"// "button" ,"checkbox"
    },
    handlers:{
        ontap:'tapHandler'
    },
    getClassName: function (value) {
        var value = value || this.value;
        return enyo.trim(value.toString()).replace(/\s+/g,"-").toLowerCase();
    },
    create:function () {
        this.inherited(arguments);
        switch (this.controlType) {
            case "text":
            // have no click event
            this.createComponent({allowHtml:true,tag:'span'/*, classes: this.getClassName()*/, content:this.value});
            break;
            case "linkbutton":
            this.createComponent({tag:'span', classes:"link-button", content:this.value});
            break;
            case "checkbox":
            this.createComponent({kind:'onyx.Checkbox', checked:this.value});
            break;
            case "button":
            this.createComponent({kind:'control.Button', content:this.value});
            break;
        }
    },
    tapHandler: function (inSender,inEvent) {
        // if(this.controlType == "text") {
        //     return true;
        // }
    }
});