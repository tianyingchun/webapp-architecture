enyo.kind({
	name: "Master.views.profile.ApiEdit",
	kind: "Master.View",
	events:{
		"onFetchApiAvailableCategories":""
	},
	handlers:{
		onFetchCategoryTree:"fetchApiAvailableCategories"
	},
	components: [
		{name:"editPanel", kind: "Master.views.controls.ApiEditPanel"}
	],
	//*@override before view render or re-render phase.
	viewReady: function (){
		 // do nothing...
	},
	loadingExistApiDetailUI: function (viewModel, data){
		this.$.editPanel.set("viewModel", viewModel);
		// hide loading spinner.
		Master.view.frame.hideSpinnerPopup(data.spinner_uid);
	},
	fetchApiAvailableCategories: function (inSender, inEvent) {
		// goto fetch availble categories tree.
		var config = {
			viewPage: "api",
			viewKind: "profile.ApiEdit",
			editModel: true
		};
		this.bubble("onFetchApiAvailableCategories", config);
		return true;
	},
	showAvalilableCategories: function (viewModel) {
		this.$.editPanel.set("categoriesViewModel", viewModel);
	}
});