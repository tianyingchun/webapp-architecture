/**
 * This is master collection.
 * @class Master.Collection
 * @extends {enyo.Collection}
 */
enyo.kind({
	name: "Master.Collection",
	kind: "enyo.Collection",
	mixins:[
		"Master.ClassSupport"
	],
	testCollectionMethod: function () {
		var log = [{test:"json object"},{my:"name"}];
		this.zLog("test method",log);
		this.log("test method1", log);
		this.zError("test", log);
		this.zWarn("test", log)
	}
});