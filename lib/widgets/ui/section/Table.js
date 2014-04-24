enyo.kind({
	name: "widgets.section.Table",
	kind: "widgets.section.Abstract",
	handlers: {
		oninput:"inputValueChanged"
	},
	published: {
		columns : 4,
		rows: 4
	},
	//*@protected override Abstract class.
	drawInterface: function () {
		this.placeCustomizedHeaderControls([
			{tag: "span", content: "Columns: ", classes: "table"},
			{name:"inputTextColumn", action:"column", kind:"onyx.Input", classes:"table", type:"number", value: this.columns},
			{tag: "span", content: "Rows:", classes: "table"},
			{name:"inputTextRow", action:"row", kind:"onyx.Input", classes:"table", type:"number", value: this.rows}
		]);
		this.placeClientControl(this._drawTable()); 
	},
	//*@public override exist section  json result.
	getSectionJSONResult: enyo.inherit(function (sup) {
		return function () {
			var result = sup.apply(this, arguments);
			result.source = this.$markItUp.getEditorContent();
			this.zLog(result);
			return result;
		};
	}),
	inputValueChanged: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		var val = $originator.getValue(); 
		// must be number type.
		if(val && !isNaN(val)) {
			val = val > 0 ? val: 1;
			if ($originator.action=="column") {
				this.set("columns", val);
			} else{
				this.set("rows", val);
			}
			this._drawTable(this.get("rows"), this.get("columns"));
		}
		return true;
	},
	// *@ private return kind table object.
	_drawTable: function (row, column) {
		this.zLog(row, column);
		var kind = {
			content:'sdddddddddddddddd'
		};
		return kind;
	},
	_drawRows: function (columns) {

	}
});