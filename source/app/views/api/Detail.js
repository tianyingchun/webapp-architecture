enyo.kind({
	name: "Master.views.api.Detail",
	kind: "Master.View",
	classes:"api-details",
	components:[
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name: "detailcontainer", showing: false, components: [
			{ name:"nodeInfo", classes:"api-basic-info", components: [
				{name:"apiTitle", tag:"h4", classes:"api-title"},
				{name:"apiDesc",  classes:"api-desc"}
			]},
			{ name:"sectionManager", kind: "widgets.section.SectionManager", model:"view"}
		]}	
	],
	// show category detail information.
	showApiDetailUI: function (viewModel, extraData) {
		this.zLog("viewModel: ", viewModel, "extraData: " ,extraData);	
		this.$.apiTitle.setContent(viewModel.get("name"));
		this.$.apiDesc.setContent(viewModel.get("description"));
		this.initSectionManager(viewModel.get("section"));
		this.$.message.hide();
		this.$.detailcontainer.show();
	},
	initSectionManager: function(section) {
		this.$.sectionManager.set("sections", section||[]);
	}
});