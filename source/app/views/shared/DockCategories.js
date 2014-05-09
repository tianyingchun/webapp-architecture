enyo.kind({
	name: "Master.views.shared.DockCategories",
	kind: "Master.View",
	components:[
		{name:"message", kind:"widgets.base.Spinner",size:25, message: Master.locale.get("LOAD_CATEGORIES", "message")},
		{name: "categoriesContainer", showing: false}
	],
	// show categories in left dock if we directly enter specific api page.
	// e.g. http://localhost:8000/debug.html#node/bravo-a/java
	showUICategories: function (viewModel, extraData) {
		this.zLog("show user categories view model: ", viewModel, extraData);
		// save latest dock category level configurations.
		Master.view.frame.setCurrentCategoryDockConfig(extraData || {
			fromLevel: 0,
			toLevel: 1
		});
		this.destroyClientControls();
		var records = viewModel.records;
		// var categoryKey = extraData && extraData.apiKey;
		currentNodeKey = location.hash;

		// destroy first.
		this.$.categoriesContainer.destroyClientControls();
		
		this.$.categoriesContainer.createClientComponents([
			{ kind: "widgets.menus.Accordion", itemNameField:"name",itemChildField:"children",
				itemKeyField:"key", linkConverterFn:this.hashConverterFn, selectedKey:currentNodeKey, source: records
			}
		]);
		this.$.categoriesContainer.render();
		// show categories, hide message.
		this.$.message.hide();
		// this.$.dockTitle.show();
		this.$.categoriesContainer.show();
	},
	//*@override before view render or re-render phase.
	viewReady: function () {
		this.$.message.show();
		this.$.categoriesContainer.hide();

	},

	//*@ private hash converter.
	hashConverterFn: function(item) {
		var loc = "#";
		loc = "#node/"+item["key"];
		return loc;
	}
});