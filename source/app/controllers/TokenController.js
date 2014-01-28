enyo.kind({
	name:"Master.controllers.TokenController",
	kind: "Master.Controller",
	constants: {
		CATEGORY_DETAIL_PAGE:"category.Detail"
	},
	//*@ action
	resolveToken: function () {
		this.zLog("validation....token...");
	}
})