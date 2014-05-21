enyo.kind({
	name: "Master.views.api.Search",
	kind: "Master.View",
	classes:"api-search-result",
	components: [
		{content:"待后续实现，敬请期待...."},
		{name:"docList", showPager:false, kind:"widgets.lists.PagedList",
			rowKeyField:"id",
			fields: ['id','name','key'],
			header: ['文档ID','文档名称','文档Hash','操作']
		}
	],
	//*@override Master.View
	viewReady: function () {
		// todo...
	},
	showApiListUI: function(viewModel) {
		this.zLog("viewModel", viewModel);
	}
});