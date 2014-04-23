// abstract class for all section widget controls.
enyo.kind({
	name:"widgets.section.Abstract",
	classes:"section-item",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		controlName: "",
		sectionTitle: "",
		source: null, // can be any type it will be tested in specificed section widget.
		model:"view", //view|edit
	},
	events: {
		"onSectionChanged":""
	},
	components: [
		{ classes:"section-header", components: [
			{name:"header", kind:"onyx.Input", type:"text", value: this.sectionTitle},
			{name:"removeBtn", ontap:"_removeSelfHandler", classes:"btn btn-danger remove-btn", kind:"onyx.Button", content:"Remove", showing:this.model==="edit"? true: false}
		]},
		{ name:"client", classes:"section-content"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// flag current control is section widget
			this._isSectionWidget = true;

			this.modelChanged();
			this.init();
		};
	}),
	sourceChanged: function () {
		this.reInit();
	},
	modelChanged: function () {
		if(this.model === "edit") {
			this.$.removeBtn.show();
		}
	},
	sectionTitleChanged: function () {
		this.$.header.setValue(this.sectionTitle);
	},
	//*@protected create client control.
	placeClientControl:function (component){
		this.$.client.destroyClientControls();
		this.$.client.createComponent(component);
		this.$.client.render();
	},
	//*@protected get specificed client control
	fetchClientControl: function (controlName) {
		var $client =  this.$.client;
		return $client.$[controlName];
	},
	//*@protected abstract method
	init: function () {
		this.sectionTitleChanged();
		this.drawInterface();
	},
	//*@protected abstract method
	reInit: function () {
		this.$.client.destroyClientControls();
		this.init();
	},
	//*@proteted abstract method
	drawInterface: function () {
		this.zLog("need to override this method");
	},
	//*@protected abstract method
	getSectionJSONResult: function () {
		return {
			controlName: this.getControlName(),
			sectionTitle: this.$.header.getValue(),
			source: this.getSource(),
			model: this.getModel()
		};
	},
	_removeSelfHandler: function (inSender, inEvent) {
		this.destroy();
		return true;
	}
});