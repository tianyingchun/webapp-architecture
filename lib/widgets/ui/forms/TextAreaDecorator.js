
enyo.kind({
	name: "widgets.forms.TextAreaDecorator",
	//@required
	mixins: [
		"widgets.forms.FieldValidationSupport"
	],
	// @customized handlers for each field value change event.
	handlers: {
		"oninput": "textValueChanged"
	},
	classes:"widget-forms-textarea",
	//@required
	published: {
		tipMessage: "",
		placeholder:"",
		validation: {
			// "required": "this field is required",
			// "email": "this field must be an email"
		}
	},
	components: [
		{ kind: "onyx.InputDecorator",components: [
			{name: "input", kind:"onyx.TextArea", placeholder:this.placeholder}
		]},
		{name: "message", classes:"tip-message", content:""}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// @required.. do request validation signal.
			this.doRequestValidateSignal();

			// add place holder text
			this.placeholderChanged();

			this.tipMessageChanged();
		};
	}),
	placeholderChanged: function (oldPlaceholder) {
		this.$.input.setPlaceholder(this.placeholder);
	},
	tipMessageChanged: function (oldValue) {
		this.$.message.setContent(this.tipMessage)
	},	
	//@public get input value.
	getValue: function (){
		return this.$.input.getValue();
	},
	//@private while click submit/reset button  will notify gotoValidateion()
	gotoValidation: function (data) {
		data = this.getValidationData(data);
		// send event to validate this contol.
		this.doFieldValueChanged(data);
	},
	// @private method for input change event.
	textValueChanged: function (inSender, inEvent) {
		var originator = inEvent.originator;
		var eventData = {
			validation: this.validation,
			value: originator.getValue()
		};	
		enyo.job("_textinputchangedhandler", this.bindSafely("gotoValidation", eventData), 500);
		
		return true;
	},
	// ---below is interface methods if we need to implementation form validation.
	//@protected
	//@required. interface method each control need to overried this method.
	getValidationData: function (data) {
		// this.zLog("data: ",data);
		data  = data || {
			validation: this.validation,
			value: this.$.input.getValue()
		};
		return data;
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
	}
})