/**
 * The offline source base class.
 * @override enyo.XHRSource. extends enyo xhr source. default ajax.
 * @type {String}
 */
enyo.kind({
	name: "Master.OfflineXHRSource",
	kind: enyo.XHRSource,
	//*@protected
	_requestOptions: enyo.keys(enyo.AjaxProperties)
});