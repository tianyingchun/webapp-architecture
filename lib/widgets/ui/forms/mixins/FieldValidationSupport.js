/**
 * Designed to serve as the base class for all form field control,
 * if these control need to have uniform validation ability.
 */
enyo.setPath("widgets.forms.FieldValidationSupport", {
	name: "widgets.forms.FieldValidationSupport",
	events:{
		// define event used to pass to FromDecorator control.
		"onFieldValueChanged": ""
	},
	mixins:[
		"Master.ClassSupport"
	],
	//@protected used to flag current control is form child control.
	isFormFieldControl: true,
	
	handlers: {
		// used to receive validate result waterfall event from FormDecorator.
		onValidateResult: "fieldValidateResult"
	}
});