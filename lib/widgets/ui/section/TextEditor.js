enyo.kind({
	name: "widgets.section.TextEditor",
	kind: "widgets.section.Abstract",
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.$markItUp = this.fetchClientControl("textEditor");
			if(this.$markItUp) {
				this.$markItUp.markItUp();
				this.$markItUp.setEditorContent(this.getSource());
			}
		};
	}),
	//*@protected override Abstract class.
	drawInterface: function () {
		this.placeClientControl({
			name:"textEditor", kind:"Master.TextEditor"
		}); 
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