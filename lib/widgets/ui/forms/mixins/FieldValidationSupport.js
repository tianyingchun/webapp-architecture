/**
 * Designed to serve as the base class for all form field control,
 * if these control need to have uniform validation ability.
 */
enyo.setPath("widgets.forms.FieldValidationSupport", {
	name: "widgets.forms.FieldValidationSupport",
	events:{
		// define event used to pass to FromDecorator control.
		"onFieldValueChanged": "",
		"onRequestValidateSignal":"",// this events will bubble on to the FormDecorator.js
		// allow form field control has it's own async/sync validation for specical case.
		"onCustomizedValidateControl":""
	},
	mixins:[
		"Master.ClassSupport"
	],
	//@protected used to flag current control is form child control.
	isFormFieldControl: true,
	
	handlers: {
		// used to receive item validate result waterfall event from FormDecorator.
		onItemValidateResult: "fieldValidateResult"
	},
	//@protected
	//@required. interface method each control need to overried this method.
	/*getValidationData: function () {

	},*/
	//@preotecte
	//@required
	/*fieldValidateResult: function (inSender, inEvent) {
		//receive vlidate result from formdecorator.
	}*/
});