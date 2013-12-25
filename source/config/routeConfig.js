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
		{ path: "home/index", default:true, controller: "HomeController", action: "index"},
		{ path: "product/:id/p:page", controller: "ProductController", action: "show"},
		{ path: "product/:id", controller: "ProductController", action: "index"}
	]);
})(enyo);
