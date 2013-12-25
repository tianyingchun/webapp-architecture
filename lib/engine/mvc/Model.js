/**
 * This is master model.
 * @class Master.Model
 * @extends {enyo.Model}
 */
enyo.kind({
	name: "Master.Model",
	kind: "enyo.Model",
	mixins:[
		"Master.ClassSupport"
	],
	testModelMethod: function () {
		var log = [{test:"json object"},{my:"name"}];
		this.zLog("test method",log);
		this.log("test method1", log);
		this.zError("test", log);
		this.zWarn("test", log)
	}
});