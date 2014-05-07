enyo.setPath("Master.controllers.CategoryTreeSupport", {
	name: "Master.controllers.CategoryTreeSupport",
	handlers:{
		"onFetchApiAvailableCategories":"fetchApiAvailableCategories"
	},
	fetchApiAvailableCategories: function(inSender, inEvent){
		var config = {
			viewPage: inEvent.viewPage,
			editModel: inEvent.editModel,
			viewKind:  inEvent.viewKind
		};
		var categoryModel = this.getCollectionInstance("Master.models.apipool.Categories");
		categoryModel.getApiCategories(this.bind("_showAvailableCategories", config));
	},
	// show available categories.
	_showAvailableCategories: function (config, viewModel){
		// indicates if it's edit api/category model.
		var isEditModel = config.editModel;
		// indicates current view page is category view, or api view.
		var viewPage = config.viewPage;
		// customized view kind.
		var viewKind = config.viewKind;
		if (!viewKind) { 
			var _viewName = isEditModel ? "profile.ApiEdit":"profile.ApiNew"; 
		} else {
			_viewName = viewKind;
		}
		this.notifyView(_viewName, viewModel, {
			action:"showAvalilableCategories" // defined in view.
		});
	},
});