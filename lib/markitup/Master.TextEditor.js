/**
 * Third part text editor libaray, integrated with in enyo js.
 * dependancy: jquery.
 */
(function(enyo) {
	// defined text editor uuid
	var textEditorUUID = 1;
	enyo.kind({
		name: "Master.TextEditor",
		mixins: [
			"Master.ClassSupport"
		],
		classes: "lib-text-editor",
		published: {
			// default editor height
			height: 150
		},
		components: [
			{name: "markItUp", classes: "libMarkItUp", attributes: {cols:"80", rows: "20"},  tag: "textarea"}
		],
		create: enyo.inherit(function (sup) {
			return function(){
				sup.apply(this, arguments);
				// set mark it up editor id.
				this.$.markItUp.setId("libMarkItUp"+(++textEditorUUID));
			};
		}),
		rendered: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
			};
		}),
		// mark it up 
		markItUp: function () {
			$("#"+this.$.markItUp.id).markItUp(myHtmlSettings);
			// set new width for markitup widget 
		    $("#"+this.$.markItUp.id).css("height", this.get("height"));
			$("#"+this.$.markItUp.id).val(this._initialHtmlContent);
		},
		//@public get html editor content.
		getEditorContent: function () {
			var content = $("#"+this.$.markItUp.id).val();
			// remove risk html code.
			content = this.stripRiskHtmlCode(content);

			// this.zLog("editor content: ", content);
			return content;
		},
		//@public set html editor content.
		setEditorContent: function (html) {
			this._initialHtmlContent = html;
			$("#"+this.$.markItUp.id).val(this._initialHtmlContent);
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
})(enyo);
