/**
 * Defined form validation control for all form child field control
 * dependancy control FormField.js, all child control need to inherite widgets.forms.FormField if 
 * it need to uniform validation handler
 * all child form field control must be placed in 
 */
enyo.kind({
	name: "widgets.forms.FormDecorator",
	mixins: [
		"Master.ClassSupport"
	],
	handlers:{
		onFieldValueChanged: "fieldValueChanged",
		// deal with submit,reset button.
		ontap: "formButtonTap"
	},
	components:[
		{name:"client", classes:"form-controls"},
		{classes:"button-wrapper", components: [
			{kind:"Button", action:"submit", name:"submitBtn", classes:"submit-button"},
			{kind:"Button", action:"reset", name:"resetBtn", classes: "reset-button"}
		]}
	],
	published: {
		submitButtonText: Master.locale.get("ACTION_SUBMIT", "label"),
		resetButtonText: Master.locale.get("ACTION_RESET","label")
	},
	// private used to sae all validate failed controls
	_failedControls: [],

	create:enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// submit button text.
		    this.submitButtonTextChanged();
		    // reset button text
		    this.resetButtonTextChanged();

			// supported validators
			this.validateFnMapping = {
				"required": "requiredValidator",
				"email": "emailValidator"
			};
		};
	}),
	// allow us customized button
	submitButtonTextChanged: function (oldButtonText){
		this.$.submitBtn.setContent(this.submitButtonText);  
	},
	resetButtonTextChanged: function (oldButtonText) {
		this.$.resetBtn.setContent(this.resetButtonText);
	},
	//@protected.
	validate: function ($control, validateData) {
		// validate sucess return structures.
		var validateResult = {
			status:"success",//failed.
			type: "sucessfull",
			message: ""
		};
		// the validation config of current form field control's
		var validation = validateData.validation;
		var value = enyo.trim(validateData.value);
		var allowEmpty = validateData.allowEmpty;

		if (allowEmpty && value == "") {
			validateResult.type = "allowEmpty";
			validateResult.message = this.getErrorMessage("allowEmpty");
			validateResult.status = "failed";
		} else {
			for(var validType in validation) {
				var validator = this[this.validateFnMapping[validType]];
				if (validator) {
					var result = validator(value);
					if (result !== true) {
						// save validate failed control
						this._failedControls.push({
							control: $control,
							validType: validType
						});
						validateResult.type = validType;
						validateResult.message = this.getErrorMessage(validType);
						validateResult.status = "failed";
						break;
					}
				} else {
					this.zError("current validator have not defined!!");
				}
			}
		}
		this.notifyFormFieldControl($control, validateResult);
	},
	// @public
	// exec this logics at the each submit form double check the all field is correct.
	// manual validate all child form control.
	validateAllControls: function () {
		// remove all faield controls.
		this._failedControls.length = 0;
		var $controls = this.getControls();
		for (var i = $controls.length - 1; i >= 0; i--) {
			var $control = $controls[i];
			if ($control.isFormFieldControl) {
				// driving child form control to exec validation (event notify)
				$control.gotoValidation();
			}
		};
		this.zLog("validate failed controls: ", this._failedControls);
		return (this._failedControls.length == 0);
	},
	fieldValueChanged: function (inSender, inEvent){
		var originator = inEvent.originator;
		var validateData = {
			allowEmpty: inEvent.allowEmpty,
			validation: inEvent.validation,
			value: inEvent.value
		};
		this.zLog("validation: ", validateData);
		// goto validate this control.
		this.validate(originator, validateData);
		return true;
	},
	// @protected.
	// notify validate result to source field control.
	notifyFormFieldControl: function ($control, result) {
		$sender = $control || this;
		$sender.waterfall("onValidateResult", result, this);
	},
	//@public submit form.
	submit: function () {
		// goto validate all form field congtrols.
		this.validateAllControls();

	},
	// validation error message
	getErrorMessage: function (validType) {
		var defaultMsg = "default validate error message!";
		defaultMsg = Master.locale.get(validType.toUpperCase(), "validationMsg") || defaultMsg;
		this.zLog("validType: ", validType, "validMessage: ", defaultMsg);
		return defaultMsg;
	},
	//---------private helper validators--------------//
	requiredValidator: function (value){
		return utility.isRequired(value);
	},
	emailValidator: function (value) {
		return utility.isEmail(value);
	},
	//@private for deal with the form submit/reset buttin event.
	formButtonTap: function (inSender, inEvent) {
		var originator = inEvent.originator;
		switch(originator.action) {
			case "submit": 
				this.execSubmitHandler(inSender, inEvent);
				break;
			case "reset":
				this.execResetHandler(inSender,inEvent);
				break;
		}
		return true;
	},
	// submit button tap handler.
	execSubmitHandler: function (inSender, inEvent) {
		this.zLog("exec submit form handler.");
		this.submit();
	},
	// reset button tap handler.
	execResetHandler: function (inSender, inEvent) {
		// do nothing...
	}
});