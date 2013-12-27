enyo.kind({
	name: "Master.models.ApiPool",
	kind: "Master.Model",
	// Api configurations here!
	apis: {
		// api id: getApiList
		getApiList:{
			url: "/api/list",
			postBody: { username: "tianyingchun" }, // {username:'terence tian', pwd:'123456'}
			headers: { Authorization:"" }, 
			cache: {
				enabled: true,
				cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
			},
			dto: "apiListDataDTO",
			success: null,
			fail: null
		}
	},
	getApiList: function(fn) {
		this.zLog("get api list...");
		this.fetchApiData("getApiList", {
			postBody: { user: 'tianyingchun' },
			success: fn
		});
	},
	apiListDataDTO: function (data, call) {
		this.zLog("apiListDataDTO...", data, call);
		return {
			api: {
				name: "tianyingchun"
			}
		};
	}
});