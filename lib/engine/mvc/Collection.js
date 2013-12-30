/**
 * This is master collection.
 * @class Master.Collection
 * @extends {enyo.Collection}
 */
enyo.kind({
	name: "Master.Collection",
	kind: "enyo.Collection",
	mixins:[
		"Master.ClassSupport",
		"Master.CommonDTOSupport",
		// provider basic methods infrastures for model, collection.
		"Master.ModelSupport"
	],

	// default we don't need to instance all records as specificed model. and we can use  collection.createRecord()
	// to create model record if we need. it will invoke store.createRecord() to create an new model istance.
	// records[0] = this.createRecord(records[0], null, false);
	instanceAllRecords: false,

	constructed: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// we must set urlRoot in constructed or contructor need to wait Master.config is ready
			this.urlRoot = Master.config.urlRoot;
			// ajax cache bust.
			this._defaultApiOpts.cacheBust = Master.config.cacheBust;
			this._setupStoreSource();
		};
	}),
	/**
	 * Ovveride parse methods
	 * @override
	 * @param {object} data the api request options.
	 */
	parse: function (data){
		var uniformData = this.defaultDTO(data);
		// check if has customized dto.
		var customizedDto = this.api.dto;
		if (customizedDto) {
			uniformData = enyo.call(this, customizedDto, [uniformData]);
		}
		this.zLog("parsed data: ", uniformData);
		return uniformData;
	}
});