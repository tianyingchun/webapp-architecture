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

		// { path: "profile/login", controller: "ProfileController", "login"},
		{ path: "profile/node/list/:id/:page", controller: "ProfileController", action:"apiPagedList"},
		{ path: "profile/node/list/:id", controller: "ProfileController", action:"apiList"},
		{ path: "profile/node/:id", controller: "ProfileController", action:"editApi"},
		{ path: "profile/node/new", controller: "ProfileController", action:"addNewApi"},

		// static router.
		{ path: "home/index", default:true, controller: "HomeController", action: "index"},
		// api show router config.
		{ path: "node/:api/:language", controller: "ApiController", action: "detail"},
		{ path: "node/:api", controller: "ApiController", action: "index"},
		{ path: "c/:api", controller: "CategoryController", action: "detail"},



		// categories managerment.
		{ path: "profile/category/list/:page", controller: "ProfileController", action:"categoryList"},
		{ path: "profile/category/list", controller: "ProfileController", action:"categoryList"},
		{ path: "profile/category/add", controller: "ProfileController", action:"addNewCategory"},
		{ path: "profile/category/edit/:id", controller: "ProfileController", action:"editCategory"},

		// user oauth login resolve token.
		{ path: "token/oauth", controller: "TokenController", action: "resolveToken"}
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
