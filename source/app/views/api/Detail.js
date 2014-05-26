enyo.kind({
	name: "Master.views.api.Detail",
	kind: "Master.View",
	classes:"api-details",
	handlers: {
		ontap:"srollToControl",
		"onSectionChanged":"sectionManagerViewChangeHandler"
	},
	components:[
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name: "detailcontainer", showing: false, components: [
			{ name:"nodeInfo", classes:"api-basic-info", components: [
				{name:"apiTitle", tag:"h4", classes:"api-title"},
				{name:"apiDesc", allowHtml:true, classes:"api-desc"},
				{name:"sectionSummary", showing: false, classes:"section-summary"}
			]},
			{ name:"sectionManager", kind: "widgets.section.SectionManager", model:"view"}
		]}	
	],
	//*@override before view render or re-render phase.
	viewReady: function (){
		this.$.message.show();
		this.$.detailcontainer.hide();
		this.$.sectionSummary.destroyClientControls();
	},
	// show category detail information.
	showApiDetailUI: function (viewModel, extraData) {
		this.zLog("viewModel: ", viewModel, "extraData: " ,extraData);	
		this.$.apiTitle.setContent(viewModel.get("name"));
		this.$.apiDesc.setContent(utility.stripRiskHtmlCode(viewModel.get("description")));
		var sections = viewModel.get("section");
		this.showSectionSummary(sections);
		this.initSectionManager(sections);
		this.$.message.hide();
		this.$.detailcontainer.show();
	},
	showSectionSummary: function (sections) {
		if (sections && sections.length) {
			this.$.sectionSummary.show();
			var _components = [];
			for (var i = 0; i < sections.length; i++) {
				var section = sections[i];
				if((typeof section.displaySectionTitle ==="undefined") || section.displaySectionTitle) { 
					_components.push({tag:"span", sectionIndex:i, action:"scrollTo", content: section.sectionTitle});
				}
			};
			this.$.sectionSummary.createClientComponents(_components);
			this.$.sectionSummary.render();
		}
	},
	srollToControl: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		if ($originator.action == "scrollTo") {
			this.$.sectionManager.srollTo($originator.sectionIndex);
		}
	},
	initSectionManager: function(section) {
		this.$.sectionManager.set("sections", section||[]);
	},
	sectionManagerViewChangeHandler: function (inSender, inEvent) {
		Master.view.frame.notifyTwoColumnLayoutReflow(500);
		return true;
	}
});