(function (enyo) {
	if (enyo.getPath("Master.MvcSupport")) {
		return;
	}
	enyo.setPath("Master.MvcSupport", {
		name: "Master.MvcSupport",
		//*@ public
		//@param kind {string} the model kind name.
		//@param opts: schema-> {primaryKey: "",euid:""}, eg.g {id: "apiid", euid:'3650006a-cfaf-316165c5-d93932bccc7'}
		//Get Model instance from enyo.store.records cache.
		getModelInstance: function (kind, opts) {
			opts = opts || {};
			if(enyo.isString(kind)) {
				var records = enyo.store.findLocal(kind, opts);
				// found multi records
				if(enyo.isArray(records) && records.length) {
					this.log("get model instance from enyo.store records[0] cache ok!");
					return records[0];
				} else if(enyo.isObject(records)) {
					this.log("get model instance from enyo.store records cache ok!");
					// found single instance model.
					return records;
				} else {
					// in fact, we had better always pass primaryKey.
					var attrs = enyo.clone(opts);
					delete attrs.euid;
					// set new model instance.
					return enyo.store.createRecord(kind, attrs);
				}
			} else {
				this.error("Please pass kind name (string type)!");
			}
		},
		//*@public get collection instance.
		//@params opts: {euid:""}
		getCollectionInstance: function (kind, opts) {
			opts = opts || {};
			var records = enyo.store.records;
			// fast path search for single entry by euid, quickest way to find a record
			if (opts.euid) {
				return records.euid[opts.euid];
			} else {
				// we can't get collection instance via kind
				// causes of  each collection can contains a few model instance. 
				// we don't use the same collection instance to do something with it's child model instance.
				// just create new collection instance is fine.
				return enyo.createFromKind(kind);
			}
		}
	});
})(enyo);