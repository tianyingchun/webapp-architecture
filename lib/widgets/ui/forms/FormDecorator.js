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
	events: {
		// while we click submit button, or invoke submit() method if all child control validation passed or failed,
		// we will send onValidationComplete event.
		"onValidationComplete":""
	},
	handlers:{
		onFieldValueChanged: "fieldValueChanged",
		// while form input field created, it will broadcast signal to this control.
		onRequestValidateSignal:"attachValidationControls",
		// allow form field control has it's own async/sync validation for specical case.
		onCustomizedValidateControl: "attachCustomizedValidationControl",
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
	create:enyo.inherit(function (sup) {
		return function () {
			// Note: we can't directly defined _failedControls,_attachedValidationControl in properties
			// it will belong prototype reference object, shared with all instance
			// private used to sae all validate failed controls
			this._failedControls = [],
			// each form field costmoized control
			this._customizedFailedControls = [],
			// save all child controls, which require an validation operator within FormDecorator.
			this._attachedValidationControl = [],

			sup.apply(this, arguments);
			// submit button text.
		    this.submitButtonTextChanged();
		    // reset button text
		    this.resetButtonTextChanged();

			// supported validators
			this.validateFnMapping = {
				"required": "requiredValidator",
				"email": "emailValidator",
				"hash": "hashValidator",
				"number": "numberValidator",
				"dropdownlist":"dropDownListValidator"
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
			type: "success", // or "email",number, hash, and ....
			message: ""
		};
		// the validation config of current form field control's
		var validation = validateData.validation;
		var value = enyo.trim(validateData.value);
		// if don't allow empty field.
		if(!this._checkFieldAllowEmpty(validation, value)) {
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
	//@private
	_checkFieldAllowEmpty: function (validation, value) {
		var allowEmpty = true;
		if(enyo.isObject(validation)) {
			for (var i in validation) {
				if(typeof(validation["required"])!= "undefined") {
					allowEmpty = false;
				}
			}
		}
		return allowEmpty && (value == "");
	},
	// @public
	// exec this logics at the each submit form double check the all field is correct.
	// manual validate all child form control.
	validateAllControls: function () {
		// remove all faield controls.
		this._failedControls.length = 0;
		var $controls = this._attachedValidationControl;
		for (var i = 0; i < $controls.length; i++) {
			var $control = $controls[i];
			if ($control.isFormFieldControl) {
				// make sure the form field control implement interface method `getValidationData`
				if ($control.getValidationData) {
					// driving child form control to exec validation (event notify)
					var validateData = $control.getValidationData();
					this.validate($control, validateData);
				} else {
					this.zError("must give interface method: `getValidationData` in "+ $control.kindName);
				}
			}
		};
		// show faild controls.
		this.zLog("validate failed controls: ", this._failedControls, this._customizedFailedControls);
		return (this._failedControls.length == 0) && (this._customizedFailedControls.length == 0);
	},
	fieldValueChanged: function (inSender, inEvent){
		var originator = inEvent.originator;
		var validateData = {
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
		$sender.waterfall("onItemValidateResult", result, this);
	},
	//@public submit form.
	submit: function (callback) {
		// goto validate all form field congtrols.
		var validateResult = {status:"success"};

		if(!this.validateAllControls()){
			validateResult.status = "failed";
			this.zLog("some controls have not passed the validation.");
		}
		// if we explicitly specified one callback function, we will dismiss the bubble this events.
		if (callback && enyo.isFunction(callback)) {
			callback(validateResult);
		} else {
			this.bubble("onValidationComplete", validateResult, this);
		}
	},
	// validation error message
	getErrorMessage: function (validType) {
		var defaultMsg = "default validate error message!";
		defaultMsg = Master.locale.get(validType.toUpperCase(), "validationMsg") || defaultMsg;
		// this.zLog("validType: ", validType, "validMessage: ", defaultMsg);
		return defaultMsg;
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
		// this.zLog("exec submit form handler.");
		this.submit();
	},
	// reset button tap handler.
	execResetHandler: function (inSender, inEvent) {
		// do nothing...
	},
	// @private attach all child controls which need to request an validation.
	attachValidationControls: function (inSender, inEvent) {
		var originator = inEvent.originator;
		if (originator.isFormFieldControl === true){
			this._attachedValidationControl.push(originator);
		} else {
			this.warn("have not mixin FieldValidationSupport..");
		}
		return true;
	},
	//*@ receive fail signal save it.
	attachCustomizedValidationControl: function (inSender, inEvent) {
		this.zLog(inEvent);
		var originator = inEvent.originator,
			$control = inEvent.control,
		 	_validateType = inEvent.type,
		 	_status = inEvent.status,
		 	_id = inEvent.id;
		var _curControl = null;
		var _index = 0;
		if (originator.isFormFieldControl === true) {
			for (var i = 0; i < this._customizedFailedControls.length; i++) {
				var failedControl = this._customizedFailedControls[i];
				if(failedControl.id == _id) {
					_curControl = failedControl;
					_index = i;
					break;
				}
			};
			// current new control information.
			var _newControl = {
				id: _id,
				control: $control,
				validType: _validateType,
				status: _status
			};
			if (_status == "success") {
				// if found and status  is success. remove it.
				if (_curControl) {
					// remove it
					this._customizedFailedControls.splice(_index, 1);
				}
			} else {
				if (_curControl) {
					// replace it.
					this._customizedFailedControls.splice(_index, 1, _newControl);
				} else {
					// add it.
					this._customizedFailedControls.push(_newControl);
				}
			}
			this.zLog("_customizedFailedControls: ", this._customizedFailedControls);
		} else {
			this.warn("have not mixin FieldValidationSupport..");
		}
		return true;
	},
	//*@private
	// ==========================================================
	// helper validators start
	requiredValidator: function (value){
		return utility.isRequired(value);
	},
	emailValidator: function (value) {
		return utility.isEmail(value);
	},
	// for url hash key validation regex.
	hashValidator: function (value) {
		return utility.isHashUrl(value);
	},
	numberValidator: function (value) {
		return utility.isNumeric(value);
	},
	dropDownListValidator: function (value) {
		if(value) {
			return true;
		}
		return false;
	}
	// ============================================================
	//helper validators end.
});