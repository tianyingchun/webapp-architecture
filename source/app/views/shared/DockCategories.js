enyo.kind({
	name: "Master.views.shared.DockCategories",
	kind: "Master.View",
	components:[
		{name:"message", kind:"widgets.base.Spinner",size:25, message: Master.locale.get("LOAD_CATEGORIES", "message")},
		{name:"dockTitle",showing:false, classes: "dock-title", content:Master.locale.get("API_CATALOG","title")},
		{name: "categoriesContainer", showing: false}
	],
	// show categories in left dock if we directly enter specific api page.
	// e.g. http://localhost:8000/debug.html#node/bravo-a/java
	showUICategories: function (viewModel, extraData) {
		this.zLog("show categories view model: ", viewModel);
		this.destroyClientControls();
		var records = viewModel.records;
		var categoryKey = extraData && extraData.apiKey;
		categoryKey = location.hash;
		
		this.$.categoriesContainer.createClientComponents([
			{ kind: "widgets.menus.Accordion", itemNameField:"categoryName",
				itemKeyField:"categoryKey", linkConverterFn:this.hashConverterFn, selectedKey:categoryKey, source: records
			}
		]);
		this.$.categoriesContainer.render();
		// show categories, hide message.
		this.$.message.hide();
		// this.$.dockTitle.show();
		this.$.categoriesContainer.show();
	},
	//*@ private hash converter.
	hashConverterFn: function(item) {
		var loc = "#";
		if(item && item.isCategoryNode) {
			loc = "#c/"+item[this.itemKeyField];
		} else {
			loc = "#node/"+item[this.itemKeyField];
		}
		return loc;
	}
});