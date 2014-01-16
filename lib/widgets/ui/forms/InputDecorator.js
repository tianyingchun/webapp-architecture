enyo.kind({
	name: "widgets.forms.InputDecorator",
	//@required
	mixins: [
		"widgets.forms.FieldValidationSupport"
	],
	// @customized handlers for each field value change event.
	handlers: {
		"oninput": "textValueChanged"
	},
	classes:"widget-forms-input",
	//@required
	published: {
		type: "text",	//"url", "email", "search", or "number".
		allowEmpty: true,
		tipMessage: "",
		placeholder:"",
		validation: {
			// "required": "this field is required",
			// "email": "this field must be an email"
		}
	},
	components: [
		{ kind: "onyx.InputDecorator",components: [
			{name: "input", kind:"onyx.Input", type: this.type, placeholder:this.placeholder}
		]},
		{name: "message", classes:"tip-message", content:""}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// add input type.
			this.typeChanged();
			// add place holder text
			this.placeholderChanged();

			this.tipMessageChanged();
		};
	}),
	typeChanged: function (oldType) {
		this.$.input.setType(this.type);
	},
	placeholderChanged: function (oldPlaceholder) {
		this.$.input.setPlaceholder(this.placeholder);
	},
	tipMessageChanged: function (oldValue) {
		this.$.message.setContent(this.tipMessage)
	},	
	//@required method 
	//@protected. the interface methods. while click submit/reset button  will notify gotoValidateion()
	gotoValidation: function (data) {
		this.zLog("data: ",data);
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
	 * @params inEvent: {type:"required|email|..", message:"dddd", status:"success:faield"} 
	 */
	fieldValidateResult: function (inSender, inEvent) {
		this.zLog("received validation result: ", inEvent);
		var errorMsg = this.validation[inEvent.type] || inEvent.message;
		var $message = this.$.message;
		if (inEvent.status == "success") {
			$message.addClass("success");
			$message.removeClass("failed");
		} else {
			$message.removeClass("success");
			$message.addClass("failed");
		}
		$message.setContent(errorMsg);
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
		enyo.job("_textinputchangedhandler", this.bindSafely("gotoValidation", eventData), 500);
		
		return true;
	}
})