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
		value: "",
		tipMessage: "", //The hint message for this control.
		placeholder:"", // the place holder for input box.
		validation: {
			// "required": "this field is required", :: required: the validate type, it need be supported by FormDecorator.js
			// "email": "this field must be an email"
		},
		ajax: "" // customized ajax validation, it will be invoked while all validation regular has passed.
	},
	components: [
		{ kind: "onyx.InputDecorator",components: [
			{name: "input", kind:"onyx.Input", type: this.type, placeholder:this.placeholder}
		]},
		{name:"message", classes:"message", components: [
			{name: "msgIcon", tag:"i"}, // message icon.
			{tag:"span", name:"messageTxt", classes:"tip-message"} // message content.
		]}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// @required.. do request validation signal.
			this.doRequestValidateSignal();
			// add input type.
			this.typeChanged();
			// add place holder text
			this.placeholderChanged();

			this.tipMessageChanged();

			this.valueChanged();

			// styling using bootstrap 3
			this._iconSuccessClass = "icon-ok";
			this._iconFailedClass = "icon-remove";
			this._iconAjaxClass = "icon-spinner icon-spin";
		};
	}),
	typeChanged: function (oldType) {
		this.$.input.setType(this.type);
	},
	valueChanged: function (oldValue) {
		this.$.input.setValue(this.value);
	},
	placeholderChanged: function (oldPlaceholder) {
		this.$.input.setPlaceholder(this.placeholder);
	},
	tipMessageChanged: function (oldValue) {
		this.$.messageTxt.setContent(this.tipMessage)
	},	
	//@public get input value.
	getValue: function (){
		return this.$.input.getValue();
	},
	//@public
	setValue: function (value) {
		this.$.input.setValue(value);
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
	// *@ private we can has control own validation for speical case e.g. user name async check.
	sendCustomizedControlSignal: function (data){
		this.doCustomizedValidateControl(data);
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
		if (inEvent.status == "success") {
			this._showSuccess();
			// if has ajax cutmozied async validation do it.
			if(this.ajax) {
				// show async checking..
				this._showAjaxSpinner();
				// do validation async.
				this.ajaxValidation();

			}
		} else {
			this._showError(errorMsg);
		}
		return true;		
	},
	_showError: function (errorMsg) {
		var $msgIcon = this.$.msgIcon;
		var $message = this.$.message;
		var $msgTxt = this.$.messageTxt;
		$message.addClass("failed");
		$message.removeClass("success");
		
		$msgIcon.removeClass(this._iconSuccessClass);
		$msgIcon.removeClass(this._iconAjaxClass);

		$msgIcon.addClass(this._iconFailedClass);

		$msgTxt.setContent(errorMsg);
	},
	_showAjaxSpinner: function (loadingMsg) {
		var $msgIcon = this.$.msgIcon;
		var $message = this.$.message;
		var $msgTxt = this.$.messageTxt;
		$message.removeClass("failed");
		$message.removeClass("success");
		
		$msgIcon.removeClass(this._iconSuccessClass);
		$msgIcon.removeClass(this._iconFailedClass);

		$msgIcon.addClass(this._iconAjaxClass);

		$msgTxt.setContent(loadingMsg||"");
	},
	_showSuccess: function () {
		var $msgIcon = this.$.msgIcon;
		var $message = this.$.message;
		var $msgTxt = this.$.messageTxt;
		$message.addClass("success");
		$message.removeClass("failed");
		
		$msgIcon.removeClass(this._iconFailedClass);
		$msgIcon.removeClass(this._iconAjaxClass);

		$msgIcon.addClass(this._iconSuccessClass);
	},
	//*@private helper to validate input value from server.
	ajaxValidation: function () {
		var value = this.getValue();
		var context = this.owner || this;
		var fn = enyo.isFunction(this.ajax) || context[this.ajax];
		if(fn) {
			// while we click submit button in fromDecorator.js
			// it will loop all attached controls, if this control has passed all `this.validation` it will
			// also invoke ajaxValidation if have defined  this.ajax 
			// but ui has been destroyed, so we need to use bindSafely to bind callback.
			fn.call(context, value, this.bindSafely("_ajaxValidationComplete"));
		}
	},
	_ajaxValidationComplete: function (result) {
		this.zLog("result: ", result);
		var _status = "faield";
		if(result.status == "success") {
			_status = "success";
			this._showSuccess();
		} else {
			this._showError(result.message);
		}
		this.sendCustomizedControlSignal({
			id:this.id, 
			control: this, 
			type: "ajax",
			status: _status
		});
	}
})