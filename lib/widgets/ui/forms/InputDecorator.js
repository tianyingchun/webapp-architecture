enyo.kind({
	name: "widgets.forms.InputDecorator",
	kind: "onyx.InputDecorator",
	//@required
	mixins: [
		"widgets.forms.FieldValidationSupport"
	],
	// @customized handlers for each field value change event.
	handlers: {
		"oninput": "textValueChanged"
	},
	//@required
	published: {
		type: "text",	//"url", "email", "search", or "number".
		allowEmpty: true,
		tipMessage: "",
		validation: {
			// "required": "this field is required",
			// "email": "this field must be an email"
		}
	},
	components: [
		{name: "input", kind:"onyx.Input", type: this.type},
		{name: "message", classes:"tip-message", content:""}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.tipMessageChanged();
		};
	}),
	tipMessageChanged: function (oldValue) {
		this.$.message.setContent(this.tipMessage)
	},	
	//@required method 
	//@protected. the interface methods. while click submit/reset button  will notify gotoValidateion()
	gotoValidation: function (data) {
		data  = data || {
			validation: this.validation,
			value: this.$.input.getValue(),
			allowEmpty: this.allowEmpty
		};
		// send event to validate this contol.
		this.doFieldValueChanged(data);
	},
	/**
	 * @required method to receive the validation result.
	 * @protected
	 * The method used to receive validate result from FormDecorator 
	 */
	fieldValidateResult: function (inSender, inEvent) {
		this.zLog("received validation result: ", inEvent);
		this.$.message.setContent(inEvent.message);
		return true;
	},
	// @private method for input change event.
	textValueChanged: function (inSender, inEvent) {
		var originator = inEvent.originator;
		var eventData = {
			validation: this.validation,
			value: originator.getValue(),
			allowEmpty: this.allowEmpty
		};	
		this.gotoValidation(eventData);
		return true;
	},
})