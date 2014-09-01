enyo.kind({
	name: "Master.views.shared.DockCategories",
	kind: "Master.View",
	components:[
		{kind: "Signals", onMenuAccrodionUpdate: "menuAccrodionUpdate"},
		{name:"message", kind:"widgets.base.Spinner",size:25, message: Master.locale.get("LOAD_CATEGORIES", "message")},
		{name: "categoriesContainer", showing: false}
	],
	// show categories in left dock if we directly enter specific api page.
	// e.g. http://localhost:8000/debug.html#node/bravo-a/java
	showUICategories: function (viewModel, extraData) {
		this.zLog("show user categories view model: ", viewModel, extraData);
		// save latest dock category level configurations.
		Master.view.frame.setCurrentCategoryDockConfig(extraData || {
			parentId: 0,
			level: 0
		});
		var records = viewModel.records;
		
		this.destroyClientControls();
		// var categoryKey = extraData && extraData.apiKey;
		currentNodeKey = location.hash;

		// destroy first.
		this.$.categoriesContainer.destroyClientControls();
		
		this.$.categoriesContainer.createClientComponents([
			{ 	
				name:"accordionMenu",
				kind: "widgets.menus.Accordion", 
				itemNameField:"name",
				itemChildField:"children",
				itemExpendedField:"isExpanded",
				itemKeyField:"key", 
				linkConverterFn:this.hashConverterFn, 
				selectedKey:currentNodeKey, source: records
			}
		]);
		this.$.categoriesContainer.render();
		this.$.categoriesContainer.show();
		// show categories, hide message.
		this.$.message.hide();
	},
	//*@private for signal event.
	//local refresh ui with lastes has location
	menuAccrodionUpdate: function () {
		if(this.$.accordionMenu) {
			this.$.accordionMenu.highlightMenuItem(location.hash);
		}
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