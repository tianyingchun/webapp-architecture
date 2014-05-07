enyo.kind({
	name: "Master.views.api.Detail",
	kind: "Master.View",
	classes:"api-details",
	components:[
		{name:"message",kind:"widgets.base.Spinner", message: Master.locale.get("LOAD_CATEGORY_DETAIL", "message")},
		{name: "detailcontainer", showing: false, components: [
			{ name:"nodeInfo", classes:"api-basic-info", components: [
				{name:"apiTitle", tag:"h4", classes:"api-title"},
				{name:"apiDesc",  classes:"api-desc"},
				{name:"sectionSummary", showing: false, classes:"section-summary"}
			]},
			{ name:"sectionManager", kind: "widgets.section.SectionManager", model:"view"}
		]}	
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			if (this.viewModel) {
				var apiModel = new Master.models.apipool.ApiItem();
				apiModel.setObject(this.viewModel);
				this.showApiDetailUI(apiModel);
			}
		};
	}),
	// show category detail information.
	showApiDetailUI: function (viewModel, extraData) {
		this.zLog("viewModel: ", viewModel, "extraData: " ,extraData);	
		this.$.apiTitle.setContent(viewModel.get("name"));
		this.$.apiDesc.setContent(viewModel.get("description"));
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
				_components.push({tag:"span", content: section.sectionTitle});
			};
			this.$.sectionSummary.createClientComponents(_components);
			this.$.sectionSummary.render();
		}
	},
	initSectionManager: function(section) {
		this.$.sectionManager.set("sections", section||[]);
	}
});