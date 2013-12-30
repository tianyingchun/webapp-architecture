enyo.kind({
	name: "Master.models.ApiPool",
	kind: "Master.Model",
	// override api configurations here!
	api: {
		url: "/api/list",
		postBody: { username: "tianyingchun" }, // {username:'terence tian', pwd:'123456'}
		headers: { Authorization:"" }, 
		cache: {
			enabled: true,
			cacheTime: 10 * 60 * 1000 // cache time the expired time enyo.now() + cacheTime.
		},
		dto: "apiListDataDTO"
	},
	defaults: {
		apiName: "",
		apiDescription: "",
		apiParams:{},
		apiSampleCode:{
			cshap: "cshap",
			java:"java"
		}
	},
	/**
	 * Get api list 
	 * @public
	 * @param  {Function} fn data response result
	 */
	getApiList: function(fn) {
		this.zLog("get api list...");
		// get request.
		this.fetch({
			postBody: { user: 'tianyingchun1111' },
			callback: fn
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