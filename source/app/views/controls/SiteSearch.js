enyo.kind({
	name:"Master.views.controls.SiteSearch",
	classes: "site-search input-append",
	mixins: [
		"Master.ClassSupport"
	],
	components: [
		{name:"searchTxt", kind:"enyo.Input",onkeypress:"searchEnterKey", type:"text",classes:"span2 search-query", placeholder:"Search here..."},
		{kind:"enyo.Button", classes:"btn icon-search",ontap:"goSearch", content:"搜索"}
	],
	goSearch: function (inSender, inEvent) {
		var searchTxt = enyo.trim(this.$.searchTxt.getValue());
		this.search(searchTxt);
		return true;
	},
	setSearchValue: function (searchTxt) {
		this.$.searchTxt.setValue(searchTxt);
	},
	getSearchValue: function () {
		var searchTxt = enyo.trim(this.$.searchTxt.getValue());
		return searchTxt;
	},
	// hook enter key up event for search.
	searchEnterKey: function (inSender, inEvent) {
		if (inEvent.keyCode == KeyBoard.ENTER_KEY) {
			var searchVal = this.getSearchValue();
			this.search(searchVal);
		}
		return true;
	},
	search: function(text) {
		var query = {
			text: text
		};
		var params = encodeURIComponent(enyo.json.stringify(query));
		window.location.href = "#search/"+params;
	}
});