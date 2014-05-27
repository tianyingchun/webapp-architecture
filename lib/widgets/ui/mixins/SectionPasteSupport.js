
enyo.kind({
	name:"widgets.Section.PasteSupport",
	mixins: [
		"Master.ClassSupport"
	],
	published:{
		namespace: "pasteSupport"
	},
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.savedContents = {};
			window[this.namespace] = this;
		};
	}),
	//*@public save data to memory
	save: function (key, htmlContent) {
		this.zLog(htmlContent);
		this.savedContents[key]=htmlContent;
	},
	//*@public get saved data from memory
	get: function (key) {
		this.zLog(this.savedContents);
		return this.savedContents[key];
	},
	//*@public clear data from memory
	clear: function (key) {
		this.savedContents[key] = null;
	}
});
enyo.singleton({
	kind:"widgets.Section.PasteSupport",
	namespace: "pasteSupport"
});