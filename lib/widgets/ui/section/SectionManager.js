enyo.kind({
	name:"widgets.section.SectionManager",
	classes:"widgets-section",
	mixins: [
		"Master.ClassSupport"
	],
	events: {
		onSectionChanged:""
	},
	handlers:{
		"onSectionItemRemoved":"sectionItemRemoved"
	},
	published: {
		// section sources.
		sections: [], //{controlName:"textEditor", sectionTitle:"", model:view|edit, source:null}
		model: "view",// view|edit, it must be defined in initialize phase.
		// list all we supported section widgets.
		supportedWidgets: [
			{ id: "table",table:"widgets.section.Table"},
			{ id: "textEditor", textEditor:"widgets.section.TextEditor"}, // {controlName:kindName}
			{ id: "linkList", linkList:"widgets.section.LinkList"},
			{ id: "tabs", tabs:"widgets.section.Tabs"}
		],
		scrollYoffset: 80// default offset top : header + top nav(50+30)px
	},
	components: [
		{ name:"content"},
		// { name:"animator", kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{ name:"actionPanel", classes:"action-panel", showing:false, components :[
				{name:"controlTypes",key:"id", kind:"widgets.forms.DropdownList",defaultTitle:"--请选择Section类型--"},
				{kind:"onyx.Button", ontap:"_addNewSection", classes:"btn btn-primary addnewsection", content:"添加新Section"},
				{kind:"onyx.Button", ontap:"_pasteNewSection", classes:"btn btn-primary addnewsection", content:"粘贴新Section"}
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
			this.model = "view"; // make sure it model don't edit force it's value to "view".
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
		var components = this._createSections(this.sections);
		this.$.content.createClientComponents(components);
		this.$.content.render();
	},
	//*@private create all sections ui components.
	_createSections: function (sections) {
		var components = [];
		if(enyo.isArray(sections)) {
			// first sort sections.
			sections.sort(function(a, b) {
				return a.displayOrder - b.displayOrder;
			});
			for (var i = 0; i < sections.length; i++) {
				var section = sections[i];
				var controlName = section.controlName;
				var kind = this.ifSupportedThisControl(controlName);
				if(kind) {
					// id Display Section title.
					var isDisplaySectionTitle = true; 

					if(typeof section.displaySectionTitle !== "undefined"){
						isDisplaySectionTitle = section.displaySectionTitle;
					}
					var _section = enyo.clone(section);
					enyo.mixin(_section, {
						controlName: controlName,
						kind: kind,
						sectionTitle: section.sectionTitle || "No section title",
						model: this.model,
						displaySectionTitle: isDisplaySectionTitle,
					});
					components.push(_section);
				} else {
					this.zWarn("the section widget `"+controlName+"` can't be found!");
				}
			};
		} else {
			this.zError("the `sections` source must be array");
		}
		return components;
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
	addNewSection: function (controlName, model, data) {
		model = model || "view";
		var kind = this.ifSupportedThisControl(controlName);
		if (kind) {
			var kindCfg = {kind: kind, controlName:controlName, model: model};
			kindCfg = enyo.mixin(data, kindCfg);
			this.$.content.createComponent(kindCfg);
			var $controls = this.$.content.getControls();
			// find last append control, and render it avoid render the whole .$.content
			var $lastControl = $controls[$controls.length-1];
			$lastControl && $lastControl.render();
		} else {	
			this.zError("current section widget can't be implemented `"+controlName+"`");
		}
		this.doSectionChanged();
	},
	_pasteNewSection: function (inSender, inEvent) {
		var testCopiedData = window.pasteSupport.get("_widget_section_data_") || "";
		if(testCopiedData) {
			this.addNewSection(testCopiedData.controlName, this.model, testCopiedData);
		} else {
			this.zLog("no copied widget section data in section paste support!");
		}
	},
	//*@public scroll top for specific control.
	srollTo: function (index) {
		if(this.model == "view") {
			this.zLog("section item index: ", index);
			var $components = this.$.content.getControls();
			var $move = $components[index];
			if ($move) {
				var top = $move.getBounds().top;
				var moveTop = top+this.scrollYoffset;
				this._animateScrollToTop(moveTop);
			}
		}
	},
	_animateScrollToTop: function (moveTop) {
		// this.zLog(moveTop);
		// now don't implements animation.
		window.scrollTo(0, moveTop);
	},
	sectionItemRemoved: function (inSender, inEvent) {
		this.doSectionChanged();
		return true;
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
