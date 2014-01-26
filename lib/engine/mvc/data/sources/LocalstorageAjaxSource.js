(function (enyo) {
	/**
	 * Localstorage as cache strategry extends ajax, we can use local storage to store fetched data.
	 * @extends {Master.offlineSource}
	 * @param {kind} requestKind enyo.Ajax.
	 */
	enyo.kind({
		name: "Master.LocalstorageAjaxSource",
		kind: Master.OfflineXHRSource,
		//* Uses the _enyo.Ajax_ kind for requests
		requestKind: enyo.Ajax,
		//* Uses "GET" method.
		fetch: function (rec, opts) {
			opts.method = "GET";
			opts.url = this.buildUrl(rec, opts);
			this.go(opts);
		},
		//* Uses "POST" method if the record is new; otherwise, "PUT".
		commit: function (rec, opts) {
			opts.method = rec.isNew? "POST": "PUT";
			opts.url = this.buildUrl(rec, opts);
			opts.postBody = opts.postBody || rec.toJSON();
			this.go(opts);
		},
		//* Uses "DELETE" method.
		destroy: function (rec, opts) {
			opts.method = "DELETE";
			opts.url = this.buildUrl(rec, opts);
			this.go(opts);
		}
	});
})(enyo);