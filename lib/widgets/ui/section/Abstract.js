// abstract class for all section widget controls.
enyo.kind({
	name:"widgets.section.Abstract",
	classes:"section-item",
	mixins: [
		"Master.ClassSupport"
	],
	events: {
		"onSectionItemRemoved":""
	},
	published: {
		controlName: "",
		displayOrder: 0, // the small the high priority.
		sectionTitle: "No section title!",
		source: null, // can be any type it will be tested in specificed section widget.
		model:"view", //view|edit
	},
	components: [
		{ name:"sectionHeader", classes:"section-header", components: [
			{name:"basicControls", classes:"basic-controls", components: [
				{tag:"strong", classes:"section-title", content:"Section 标题: "},
				{name:"sectionTitle", kind:"onyx.Input", type:"text", value: this.sectionTitle},
				{tag:"strong", classes:"display-order-title", content:" 显示优先级: "},
				{name:"displayOrder", scope:"ignore", style:"width: 30px;", type:"number", kind:"onyx.Input", value: "0"},
				{name:"removeBtn", ontap:"_removeSelfHandler", classes:"btn btn-danger remove-btn", kind:"onyx.Button", content:"Remove"},
			]},
			{name:"customizedControls", showing: false, classes:"customized-controls"}
		]},
		{ name:"client", classes:"section-content"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// flag current control is section widget
			this._isSectionWidget = true;
			// preInit 
			this.preInit();
			// exec other logics
			this.modelChanged();
			this.init();
		};
	}),
	sourceChanged: function () {
		this.reInit();
	},
	modelChanged: function () {
		if(this.model === "view") { 
			this.$.sectionHeader.destroyClientControls();
			this.$.sectionHeader.createComponent({
				tag:"h5",
				classes:"section-title",
				content:this.sectionTitle
			});
			this.$.sectionHeader.render();
		} else {
			this.$.sectionTitle.setValue(this.sectionTitle);
		}
	},
	setDisplayOrderUI: function (number) {
		if (isNaN(number)) {
			number = 0;
		}
		this.$.displayOrder.setValue(number);
	},
	getDisplayOrderFromUI: function () {
		var number = this.$.displayOrder.getValue();
		if (isNaN(number)) {
			number = 0;
		}
		return number;
	},
	//*@protected create client control.
	placeClientControl:function (component){
		this.$.client.destroyClientControls();
		this.$.client.createComponent(component);
		this.$.client.render();
		this.viewChangedBubble();
	},
	//*@protected create customized client header control.
	placeCustomizedHeaderControls: function (components) {
		if(this.model == "edit" && components && components.length) {
			this.$.customizedControls.destroyClientControls();
			this.$.customizedControls.createClientComponents(components);
			this.$.customizedControls.render();
			this.$.customizedControls.show();
		} 
	},
	//*@protected get specificed client control
	fetchClientControl: function (controlName) {
		var $client =  this.$.client;
		return $client.$[controlName];
	},
	//*@protected method, we can override it.
	preInit: function () {
		this.zLog("you can override this method to pre initialize some staffs");
	},
	//*@protected abstract method
	init: function () {
		if(this.model == "edit") {
			this.setDisplayOrderUI(this.get("displayOrder"));
		}
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
			sectionTitle: this.$.sectionTitle.getValue(),
			source: this.getSource(),
			displayOrder: parseInt(this.getDisplayOrderFromUI())
			// model: this.getModel()
		};
	},
	_removeSelfHandler: function (inSender, inEvent) {
		this.bubble("onSectionItemRemoved");
		this.destroy();
		return true;
	},
	viewChangedBubble: function () {
		this.bubble("onSectionChanged");
	}
});