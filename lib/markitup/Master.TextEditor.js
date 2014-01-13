/**
 * Third part text editor libaray, integrated with in enyo js.
 * dependancy: jquery.
 */
enyo.kind({
	name: "Master.TextEditor",
	mixins: [
		"Master.ClassSupport"
	],
	classes: "lib-text-editor",
	components: [
		{name: "markItUp", id: "libMarkItUp", attributes: {cols:"80", rows: "20"},  tag: "textarea"}
	],
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
		};
	}),
	// mark it up 
	markItUp: function () {
		$("#"+this.$.markItUp.id).markItUp(myHtmlSettings);
	},
	getEditorContent: function () {
		var content = this.$.markItUp.getValue();
		this.zLog("editor content: ", content);
		// remove risk html code.
	}
});