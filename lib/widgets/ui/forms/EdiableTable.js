// return table json data.
enyo.kind({
	name: "widgets.forms.EdiableTable",
	classes:"editable-table",
	published:{
		// acttion button text.
		addButtonText:"Add New",
		removeButtonText:"Remove",
		// define table cell name. it will serve as return table content json key.
		fields: [
			// {
			// 	key: "name",
			// 	controlType: "text" //text, textarea,checkbox, htmleditor
			// }
		],// ["name","value","isRequired"]
		headers: []// it's descriptions for fields keys.
	},
	handlers:{
		ontap:"actionButtonTap"
	},
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.fieldsChanged();
			this.headersChanged();
		};
	}),
	fieldsChanged: function () {
		this.redrawInterface();
	},
	headersChanged: function (){
		this.redrawInterface();
	},
	// re draw ui interface.
	redrawInterface: function () {
		// destroy controls.
		this.destroyClientControls();
		this._createHeaderRow();
        this._createTrItem();
		this.render();
	},
	//@public. used to return customized json result.
	getJSONResult: function () {
		var result = {};
		this.zLog("editable json result:", result);
	},
	actionButtonTap: function (inSender, inEvent) {
		var originator = inEvent.originator;
		var action = originator.action;
		switch(action.toLowerCase()) {
			case "addnew":
			this.addNewTableEditRow();
			break;
			case "remove":
			this.removeTableEditRow();
			break;
		}
	},
	addNewTableEditRow:function (inSender, inEvent) {

	},
	removeTableEditRow: function (inSender, inEvent) {

	},
	_createHeaderRow: function () {
		var _components = [];
		for (var i = 0; i < this.headers.length; i++) {
			var item = this.headers[i];
			_components.push({
				tag:"li",
				classes:"item",
				content: item
			});
		};
		// add action buttton.
		// 
		_components.push({
			tag:"li",
			components:[{kind:"Button", classes:"addnewline",action:"addnew",content: this.addButtonText}],
			kind:"Button",
			classes:"item"
		});
        this.createComponent({ tag:"ul", classes:"header-row", components:_components}); 
	},
	_createTrItem: function () {
		var _components = [];
		for (var i = 0; i < this.fields.length; i++) {
			var field = this.fields[i];
			_components.push({
				tag:"li",
				item: field,
				classes: "item",
				kind:"widgets.forms.ediabletable.Cell"
			});	
		};
		_components.push({
			tag:"li",
			components:[{kind:"Button", classes:"removeline",action:"remove",content: this.removeButtonText}],
			kind:"Button",
			classes:"item"
		});
        this.createComponent({ tag:"ul", classes:"item-row", components:_components}); 
	}
});
//editable cell.
enyo.kind({
	name:"widgets.forms.ediabletable.Cell",
	published: {
		item: {
			key: "",
			controlType:""//text, textarea, htmleditor
		}
	},
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.itemChanged();
		};
	}),
	itemChanged: function () {
		if (this.item) {
			switch(this.item.controlType) {
				case "text":
					this.createComponent({
						kind: "onyx.Input",
						type: "text"
					});
				break;
				case "checkbox":
					this.createComponent({
						kind:"onyx.Checkbox",
						checked:true,
					});
				break;
				case "textarea":
				case "htmleditor":
					this.createComponent({
						kind: "onyx.Input",
						type: "text"
					});
				break;
			}
		}
	}
});