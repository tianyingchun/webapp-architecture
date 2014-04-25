enyo.kind({
	name: "widgets.section.Table",
	kind: "widgets.section.Abstract",
	handlers: {
		oninput:"inputValueChanged"
	},
	published: {
		// default columns
		columns : 4,
		// default rows.
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
	//*@override
	preInit: function () {
		// deal with source.
		// for table source it should be two demension array.
		// [
		// 		[a,b,c,d,e,f],
		// 		[a,b,c,d,e,f],
		// 		[a,b,c,d,e,f]
		// ]
		this.source = enyo.isArray(this.source) ? this.source: [];
		// for testing..
		// 
		this.source = [
	 		["Header","header1","header2","header3","header4"],
	 		["10","11","12","13","14"],
	 		["20","21","22","23","24"]
		];
		// this.model = "view";
		// if exits row keep it other wise keep default value rows equals 4
		if (this.source.length >0 ){
			this.set("rows", this.source.length);
			var cols = this.source[0];
			if(enyo.isArray(cols) && cols.length){
				this.set("columns", cols.length);
			}
		} 

	},
	inputValueChanged: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		if (this._isEditTableCell($originator)) {
			// deal table edit cell
			this._updateCellData($originator);
		} else {
			// deal section header input box.	
			var val = $originator.getValue(); 
			// must be number type.
			if(val && !isNaN(val)) {
				val = val > 0 ? val: 1;
				if ($originator.action=="column") {
					this.set("columns", val);
				} else{
					this.set("rows", val);
				}
				var tableKind = this._drawTable(this.get("rows"), this.get("columns"));
				this.placeClientControl(tableKind); 	
			}
		}
		return true;
	},
	// *@ private return kind table object.
	_drawTable: function (rowCount, colCount) {
		rowCount = rowCount || this.get("rows");
		colCount = colCount || this.get("columns");
		var _rowComponents = [];
		for (var i = 0; i < rowCount; i++) {
			_rowComponents.push(this._drawRow(i, colCount));
		};
		var kind = {
			tag:"table",
			name: "tableSection",
			classes:"section-table",
			components: _rowComponents
		};
		return kind;
	},
	//*@private 
	_drawRow: function (rowIndex, colCount) {
		var _cells = [];
		for (var i = 0; i < colCount; i++) {
			var colValue = this._findCellValue(rowIndex, i);
			_cells.push (this._drawCell(rowIndex, i, colValue));
		};
		var item = {
			tag:"tr",
			classes:rowIndex==0?"header-row":"item-row",
			components: _cells
		};
		return item;
	},
	_drawCell: function (rowIndex, colIndex, value) {
		var cell = {
			tag:"td"
		};
		var cellValue = {kind:"enyo.Input", position: { rowIndex: rowIndex, colIndex: colIndex },type:"text", value:value}

		if (this.model =="view") {
			cellValue = {tag:"span", content:value};
		}
		cell.components = [cellValue];
		return cell;
	},
	//*@private find the cell value from this.source.
	_findCellValue: function (rowIndex, colIndex) {
		var rowItem = this.source[rowIndex];
		var cellValue = rowItem && rowItem[colIndex] || "";
		return cellValue;
	},
	//*@private
	_isEditTableCell: function ($input) {
		if ($input && $input.position) {
			return true;
		}
		return false;
	},
	//*@private
	_updateCellData: function ($input) {
		var position = $input.position;
		if (!this.source[position.rowIndex]) {
			this.source[position.rowIndex] = [];
		}
		this.source[position.rowIndex][position.colIndex] = $input.getValue();
	},
	//*@public override exist section  json result.
	getSectionJSONResult: enyo.inherit(function (sup) {
		return function () {
			var result = sup.apply(this, arguments);
			result.source = this.getTableResult();
			this.zLog(result);
			return result;
		};
	}),
	/**
	 * *@ public
	 * only for edit model.
	 * 
	 * @return {array} table source result data [ [1,2],[1,2] ] 
	 */
	getTableResult: function () {
		var $table = this.fetchClientControl("tableSection");
		var $rows = $table.getControls();
		var source = enyo.cloneArray(this.source, 0);
		// remove other rows not includes in widget ui.
		source.splice($rows.length);
		return source;
 	}
});