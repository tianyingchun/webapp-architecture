enyo.kind({
	name:"widgets.section.SectionManager",
	classes:"widgets-section",
	mixins: [
		"Master.ClassSupport"
	],
	events: {
		onSectionChanged:""
	},
	published: {
		// section sources.
		sections: [], //{controlName:"textEditor", sectionTitle:"", model:view|edit, source:null}
		model: "view",// view|edit, it must be defined in initialize phase.
		// list all we supported section widgets.
		supportedWidgets: [
			{ id: "table",table:"widgets.section.Table"},
			{ id: "textEditor", textEditor:"widgets.section.TextEditor"}, // {controlName:kindName}
			{ id: "linkList", linkList:"widgets.section.LinkList"}
		]
	},
	components: [
		{ name:"content"},
		{ name:"actionPanel", classes:"action-panel", showing:false, components :[
				{name:"controlTypes",key:"id", kind:"widgets.forms.DropdownList",defaultTitle:"--请选择Section类型--"},
				{kind:"onyx.Button", ontap:"_addNewSection", classes:"btn btn-primary addnewsection", content:"添加新Section"}
			] 
		}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.modelChanged();
			// make sure the control type only exec once.
			this.loadingControlTypes();
			// initialized...
			this.init();
		};
	}),
	modelChanged: function () {
		if (this.model === "edit") {
			this.$.actionPanel.show();
		} else {
			this.$.actionPanel.hide();
		}
 	},
	sectionsChanged: function() {
		this.reInit();
	},
	reInit: function () {
		this.$.content.destroyClientControls();
		this.init();
	},	
	init:function () {
		var components = [];
		if(enyo.isArray(this.sections)) {
			for (var i = 0; i < this.sections.length; i++) {
				var section = this.sections[i];
				var controlName = section.controlName;
				var kind = this.ifSupportedThisControl(controlName);
				if(kind) {
					components.push({
						controlName: controlName,
						kind: kind,
						sectionTitle: section.sectionTitle || "No section title",
						model: this.model,
						source: section.source
					});
				}
			};
		} else {
			this.zError("the `sections` source must be array");
		} 
		this.$.content.createClientComponents(components);
		this.$.content.render();
	},
	loadingControlTypes: function () {
		var controlTypes = [];
		for (var i = 0; i < this.supportedWidgets.length; i++) {
			var widget = this.supportedWidgets[i];
			controlTypes.push( {
				id: widget["id"],
				content: widget["id"]
			});
		};
		this.$.controlTypes.set("menuItemComponents", controlTypes);
	},
	_addNewSection: function (inSender, inEvent) {
		var selectedItem = this.$.controlTypes.getSelectedItem();
		if (selectedItem) {
			var controlName = selectedItem["id"];
			this.addNewSection(controlName, this.model);
		} else {
			Master.view.frame.showAlertDialog({title:"出错了", message:"请选择Section类型！"});
		}
	},
	//*@public 
	addNewSection: function (controlName, model) {
		model = model || "view";
		var kind = this.ifSupportedThisControl(controlName);
		if (kind) {
			this.$.content.createComponent({kind: kind, controlName:controlName, model: model});
			var $controls = this.$.content.getControls();
			// find last append control, and render it avoid render the whole .$.content
			var $lastControl = $controls[$controls.length-1];
			$lastControl && $lastControl.render();
		} else {	
			this.zError("current section widget can't be implemented `"+controlName+"`");
		}
		this.doSectionChanged();
	},
	//*@private check if current control is supported.
	ifSupportedThisControl:function (controlName) {
		var kind = null;
		for (var i = 0; i < this.supportedWidgets.length; i++) {
			var widget = this.supportedWidgets[i];
			var kind = widget[controlName];
			if(kind) {
				break;
			}
		};
		return kind;
	},
	//*@public get results for all section widget.
	getResult: function () {
		var $controls = this.$.content.getControls();
		var result = [];
		for (var i = 0; i < $controls.length; i++) {
			var $control = $controls[i];
			if($control._isSectionWidget) { 
		 		result.push($control.getSectionJSONResult());
		 	}
		};
		return result;
	}
});
