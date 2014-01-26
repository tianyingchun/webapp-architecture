(function (enyo){
	/**
	 * @public
	 * @extends {Master.offlineSource}
	 * @param {kind} requestKind enyo.Ajax.
	 * Customized cache store class using websql
	 * using ajax to get update delete data and store with in local websql(html5) if broswer support websql.
	 */
	enyo.kind({
		name: "Master.WebsqlAjaxSource",
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