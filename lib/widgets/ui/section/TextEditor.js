enyo.kind({
	name: "widgets.section.TextEditor",
	kind: "widgets.section.Abstract",
	preInit: function () {
		// for testing purpose.
		// this.model = "view";	
	},
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// only for edit model
			if(this.model == "edit") {
				this.$markItUp = this.fetchClientControl("textEditor");
				if(this.$markItUp) {
					this.$markItUp.markItUp();
					this.$markItUp.setEditorContent(this.getSource());
				}
			}
		};
	}),
	//*@protected override Abstract class.
	drawInterface: function () {
		var editorKind = {
			name:"textEditor", kind:"Master.TextEditor"
		};
		if (this.model == "view") {
			editorKind = {
				allowHtml: true,
				content: this.source
			};
		}
		this.placeClientControl(editorKind); 
	},
	//*@public override exist section  json result.
	getSectionJSONResult: enyo.inherit(function (sup) {
		return function () {
			var result = sup.apply(this, arguments);
			result.source = this.$markItUp.getEditorContent();
			this.zLog(result);
			return result;
		};
	})
});