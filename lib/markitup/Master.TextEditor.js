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
		var content = $("#"+this.$.markItUp.id).val();
		// remove risk html code.
		content = this.stripRiskHtmlCode(content);
		this.zLog("editor content: ", content);

		return content;
	},
	// strip html code. 
	// 1. remove<script>...</script> 
	stripRiskHtmlCode: function (content) {
		var scriptTag = /<([\/|\s]*script\s*)>/g; 
		content = content.replace(scriptTag, function (match){
			return utility.escapeHtml(match);
		});
		return content;
	}
});