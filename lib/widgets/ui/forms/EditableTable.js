// return table json data.
enyo.kind({
    name: "widgets.forms.EditableTable",
    classes: "editable-table",
    mixins: [
        "Master.ClassSupport"
    ],
    published: {
        // acttion button text.
        addButtonText: "Add New",
        removeButtonText: "Remove",
        headers: [], // it's descriptions for cells keys.
        // define table cell name. it will serve as return table content json key.
        cells: [
            // {
            // 	key: "name",
            // 	controlType: "text" //text, textarea,checkbox, htmleditor，
            // }
        ],
        // the corresponding rows datasource for cells.
        // [{name:'ddd', value:'',isRequired:true, more:"ddd"},...]
        // each key will mapping the key defined in cells.
        // Note: each value do not encodeURIComponent().
        rowsDataSource: [] 
    },
    components:[
    	{name:"header", tag:"ul", classes:"header-row"}
    ],
    handlers: {
        ontap: "actionButtonTap"
    },
    create: enyo.inherit(function(sup) {
        return function() {
            sup.apply(this, arguments);
            this.cellsChanged();
            this.headersChanged();
        };
    }),
    //@private used to flag row UID.
    __rowUID: 0,
    cellsChanged: function() {
        this.redrawInterface();
    },
    headersChanged: function() {
    	this._createHeaderRow();
    },
    rowsDataSourceChanged: function () {
    	// remove all exist table row item except header row.
    	this.removeAllTrItems();
        this.redrawInterface();
    },
    // re draw ui interface.
    redrawInterface: function() {
    	// render all rows using giving data rows source.
    	if (this.rowsDataSource.length) {
    		for (var i = 0; i < this.rowsDataSource.length; i++) {
    			var row = this.rowsDataSource[i];
    			this._createTrItem(row);
    		};
    	} else {
    		// render default empty row.
        	this._createTrItem();
    	}
        this.render();
    },
    //@public. used to return customized json result.
    getTableJSONResult: function() {
        var result = [];
        var $rowItems = this.getControls();
        for (var i = 0; i < $rowItems.length; i++) {
        	var item = $rowItems[i];
        	if (item.isRowItem === true) {
        		var rowJson = item.getRowJSON();
        		result.push(rowJson);
        	}
        };
        this.zLog("editable json result:", result);
        return result;
    },
    //@private.
    actionButtonTap: function(inSender, inEvent) {
        var originator = inEvent.originator;
        var action = originator.action;
        if (action) {
            switch (action.toLowerCase()) {
                case "addnew":
                    this.addNewTableEditRow(inSender,inEvent);
                    break;
                case "remove":
                    this.removeTableEditRow(inSender,inEvent);
                    break;
            }
        }
        return true;
    },
    //@private
    addNewTableEditRow: function(inSender, inEvent) {
        // this.zLog("addNewTableEditRow...");
        this._createTrItem();

        // this.render(); Note: we don't need to invoke render(), it will result fresh all childs row items.
        // will lose existed data.
    },
    // @private remove current row item.
    removeTableEditRow: function(inSender, inEvent) {
    	var originator  = inEvent.originator;
        var _rowUID  = originator.rowUID;
        // this.zLog("removeTableEditRow...row uid: ",_rowUID);
        var allRowControls = this.getControls();
        for (var i = 0; i < allRowControls.length; i++) {
        	var rowControl = allRowControls[i];
        	if (rowControl.isRowItem ===true && rowControl.rowUID ==_rowUID) {
        		// desctory current control.
        		rowControl.destroy();
        	}
        };
    },
    //@private remove all table tr row items.
    removeAllTrItems: function () {
    	var allRowControls  = this.getControls();
    	for (var i = 0; i < allRowControls.length; i++) {
    		var rowControl = allRowControls[i];
    		if (rowControl.isRowItem  === true) {
    			rowControl.destroy();
    		}
    	};
    },
    //@private create header row controls.
    _createHeaderRow: function() {
        var _components = [];
        for (var i = 0; i < this.headers.length; i++) {
            var item = this.headers[i];
            _components.push({
                tag: "li",
                classes: "item",
                content: item
            });
        };
        // add action buttton.
        // 
        _components.push({
            tag: "li",
            components: [{
                kind: "onyx.Button",
                classes: "addnewline",
                action: "addnew",
                content: this.addButtonText
            }],
            kind: "Button",
            classes: "item"
        });
    	this.$.header.destroyClientControls();
    	this.$.header.createClientComponents(_components);
        this.$.header.render();
    },
    // @private
    // @param rowData, optional, it have render row with given data, otherwise crate empty row cells.
    _createTrItem: function(rowData) {
        var _components = [];
        var cells = enyo.clone(this.cells);
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            // set cell value if exists.
            cell.value = rowData && rowData[cell.key] || "";
            _components.push({
                tag: "li",
                item: cell,
                classes: "item",
                kind: "widgets.forms.editabletable.Cell"
            });
        };
        // remove action buttn
        // 
        _components.push({
            tag: "li",
            components: [{
                kind: "onyx.Button",
                classes: "removeline",
                action: "remove",
                rowUID: this.__rowUID,// row uid.
                content: this.removeButtonText
            }],
            kind: "Button",
            classes: "item"
        });
        this.createComponent({
        	kind: "widgets.forms.editabletable.Row",
            cellItems: _components,
            rowUID: this.__rowUID// flag row uid.
        });
        // rowUID++;
        this.__rowUID++;
    }
});
//@private kind for editable
enyo.kind({
	name:"widgets.forms.editabletable.Row",
    classes: "item-row",
	mixins:[
		"Master.ClassSupport"
	],
	published:{
		rowUID:0,// used to flag the unique row id
		cellItems:[] // cell items.
	},
	// used to flag this is table body row item. diff from header row item.
	isRowItem: true,

	tag:"ul",
	
	handlers: {
		"onRegisterSignal":"attachTabCellControl"
	},
	create: enyo.inherit(function (sup) {
		return function () {
			// used to save all cells attched in this control
			// Note: we must the _cell here should put it propeties, it should not be prototype property.
			this._cells =[];
			sup.apply(this, arguments);
			this.cellItemsChanged();
		};
	}),
	//@private 
	attachTabCellControl: function (inSender, inEvent) {
		var originator = inEvent.originator;
		this._cells.push(originator);
		return true;
	},
	cellItemsChanged: function () {
		this.destroyClientControls();
		this.createClientComponents(this.cellItems);
		this.render();
	},
	//@public.
	getRowJSON: function () {
		// get row json results.
		var rowJson = {};
		for (var i = 0; i < this._cells.length; i++) {
			var cell = this._cells[i];
			enyo.mixin(rowJson, cell.getCellJson());
		};
		//this.zLog("row json: ", rowJson);
		return rowJson;
	},
	destroy: enyo.inherit(function (sup){
		return function () {
			// remove all attached cells.
			// Note: we need to put this line before desctory,
			// 1.first while destory invoked, it will be firstly invoke all childs's destroy() --recursion
			this._cells.length = 0;
			sup.apply(this,arguments);
		}
	})
})
//@private kind.
//editable cell.
enyo.kind({
    name: "widgets.forms.editabletable.Cell",
    mixins: [
        "Master.ClassSupport"
    ],
    published: {
        item: {
            key: "",
            controlType: "", //text, textarea, htmleditor，
            value: "" // the initial value 
        }
    },
    events: {
    	// send current cell register request to it's parents. e.g.
    	// widgets.forms.editabletable.Row
    	"onRegisterSignal":""
    },
    // save current component instance.
    _currentComponent: null,

    create: enyo.inherit(function(sup) {
        return function() {
            sup.apply(this, arguments);
            this.itemChanged();
            // send register signnal.
            this.doRegisterSignal();
        };
    }),
    itemChanged: function() {
        if (!this.item) return;
        var controlType = this.item.controlType.toLowerCase();
        switch (controlType) {
            case "text":
                this._currentComponent = this.createComponent({
                    kind: "onyx.Input",
                    type: "text",
                    value: this.item.value
                });
                break;
            case "checkbox":
                this._currentComponent = this.createComponent({
                    kind: "onyx.Checkbox",
                    checked: this.item.value
                });
                break;
            case "textarea":
                this._currentComponent = this.createComponent({
                    kind: "onyx.TextArea",
                    value: this.item.value
                });
                break;
            case "htmleditor":
                this._currentComponent = this.createComponent({
                    kind: "widgets.forms.editabletable.HtmlEditor",
                    value: this.item.value
                });
                break;
        }
    },
    // @public .get cell json.
    getCellJson: function() {
        var json = {};
        json[this.item.key] = this._getCellValue();
        return json;
    },
    // @private .get cell value.
    _getCellValue: function() {
        var value = "";
        var controlType = this.item.controlType.toLowerCase();
        switch (controlType) {
            case "text":
            case "textarea":
            case "checkbox":
                value = this._currentComponent.getValue();
                break;
            case "htmleditor":
                value = this._currentComponent.getHtmlContent();
                break;
        }
        return value;
    }
});
// @private kind
// child controls.
// for editabletable child controls.
// control dependancy. Master.TextEditor
enyo.kind({
    name: "widgets.forms.editabletable.HtmlEditor",
    classes: "editabletable-htmleditor-button",
    components: [
    	{ name: "hideVal", kind: "enyo.Input", type: "hidden"}, 
    	{ kind: "Button", classes: "onyx-more-button"}
    ],
    mixins: [
        "Master.ClassSupport"
    ],
    published: {
    	value: ""// initial value
    },
    handlers: {
        ontap: "showHtmlEditor"
    },
    create:enyo.inherit(function (sup) {
    	return function () {
    		sup.apply(this, arguments);
    		// initial value if have.
    		this.valueChanged();
    	}
    }),
    valueChanged: function () {
    	this.$.hideVal.setValue(encodeURIComponent(this.value));
    },
    showHtmlEditor: function(inSender, inEvent) {
        // this.zLog("showHtmlEditor...");
        var currentHtml = decodeURIComponent(this.getHtmlContent());
        var htmlEditor = new widgets.dialog.HtmlEditor({
            htmlContent: currentHtml,
            confirmHandler: this.bindSafely("saveEditorContent")
        });
        htmlEditor.show();
        return true;
    },
    // save editor content into hidden input 
    saveEditorContent: function(editorHtml) {
        var html = encodeURIComponent(editorHtml);
        // this.zLog("editor html content: ", html);
        this.$.hideVal.setValue(html);
    },
    getHtmlContent: function() {
        var hideVal = this.$.hideVal.getValue();
        // this.zLog("hideVal: ", hideVal);
        return hideVal;
    }
});
