(function(enyo) {
    if (enyo.getPath("Master.MvcSupport")) {
        return;
    }
    enyo.setPath("Master.MvcSupport", {
        name: "Master.MvcSupport",
        //*@ public
        //@param kind {string} the model kind name.
        //@param opts: schema-> {primaryKey: "",euid:""}, eg.g {id: "apiid", euid:'3650006a-cfaf-316165c5-d93932bccc7'}
        //Get Model instance from enyo.store.records cache.
        getModelInstance: function(kind, opts) {
            // in fact, we had better always pass primaryKey.
            opts = opts || undefined;
            this._makesureOptions(opts);
            if (enyo.isString(kind)) {
                var records = enyo.store.findLocal(kind, opts);
                // found multi records
                if (enyo.isArray(records) && records.length) {
                    this.log("get model instance from enyo.store records[0] cache ok!");
                    return this.makesureModel(records[0], kind, opts);
                } else if (enyo.isObject(records)) {
                    this.log("get model instance from enyo.store records cache ok!");
                    // found single instance model.
                    return this.makesureModel(records, kind, opts);
                } else {
                    // set new model instance.
                    return this.makesureModel(null, kind, opts);
                }
            } else {
                this.error("Please pass kind name (string type)!");
            }
        },
        //*@ FIXME, maybe it's a bug, this is hotfix for cached model, maybe while model has been destoryed,
        //it will lose it's previous object
        //such as primarykey  equals "" ,  {id:""}
        makesureModel: function(modelInstance, kind, opts) {
            if (!modelInstance) {
                modelInstance = enyo.store.createRecord(kind, opts);
            } else {
                // if model isntance has estroyed
                if (modelInstance.destroyed) {
                    // merge option parameter to attributes.
                    enyo.mixin(modelInstance.attributes, opts);
                    // make sure the truely deleted this model instance in enyo.store.records.
                    enyo.store.removeRecord(modelInstance);

                    var attrs = enyo.clone(opts);
                    delete attrs.euid;
                    modelInstance = enyo.store.createRecord(kind, attrs);
                }
            }
            return modelInstance;
        },
        //*@public get collection instance.
        //@params opts: {euid:""}
        getCollectionInstance: function(kind, opts) {
            opts = opts || {};
            this._makesureOptions(opts);
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
        },
        bind: function(method /*, bound arguments*/ ) {
            var args = Array.prototype.concat.apply([this], arguments);
            return enyo.bind.apply(enyo, args);
        },
        //*@protected
        _makesureOptions: function(opts) {
            if (opts) {
                for (var k in opts) {
                    opts[k] = opts[k] || ""; // remove undefined convert it into "".
                };
            }
        }
    });
})(enyo);
