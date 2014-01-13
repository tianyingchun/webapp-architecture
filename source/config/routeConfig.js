(function (enyo) {
	/**
	 * e.g router confiurations.
	 * path:'jobs'                                     action: 'jobs',
  	 * path:'jobs/p:page'                              action: 'jobs',
  	 * path:'jobs/job/:job_id'                         action: 'jobsId',
  	 * path:'jobs/p:page/job/:job_id'
	 */
	enyo.setPath("Master.config.routeConfig",[
		// Homecontroller  default:true indicates current route is default .
		// Note: router config has order priority.
		// static router.
		{ path: "home/index", default:true, controller: "HomeController", action: "index"},
		// api show router config.
		{ path: "node/:api/:language", controller: "ApiController", action: "node"},
		{ path: "node/:api", controller: "ApiController", action: "index"},

		// { path: "profile/login", controller: "ProfileController", "login"},
		
		{ path: "profile/api/list", controller: "ProfileController", action:"apiList"},
		{ path: "profile/api/add", controller: "ProfileController", action:"addNewApi"},
		{ path: "profile/api/edit/:id", controller: "ProfileController", action:"editApi"},
		{ path: "profile/api/remove/:id", controller: "ProfileController", action:"removeApi"}
		
		/**
		 * dynamic router: controller action -> show().
		 * 1.match #product/1/  ->show (page:1, id:"");
		 * 2.match #product/1/100 -> show(page:1, id:100);
		 * 3.Note: we must put the complexed rules as before simple one, because it will hight priority 
		 * to match rule path. 
		 * e.g. if you input '#product/2/100/200' also {path:"product/:page/:id"} -> params:2,100 ignore 200
		 * and also matched {path:"product/:id"} -> params:2 so we need to put {path:"product/:page/:id"} on the 
		 * before of the {path:"product/:id"}.
		 */
		// { path: "product/:page/:id", controller: "ProductController", action: "show"},
		/**
		 * dynamic router:
		 * 1. match '#product/100' ->index(page:100)
		 * 2. match '#product/' -> index(page:"")
		 * 3. don't matched '#product' if there are no another matched router rules.
		 * it will use "home/index" as default router match
		 * 
		 */
		// { path: "product/:page", controller: "ProductController", action: "index"}
	]);
})(enyo);
