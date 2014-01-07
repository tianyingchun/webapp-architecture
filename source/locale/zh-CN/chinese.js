/**
 * @class singleton instance Master.lang.zh
 * enlish locale resource.
 * @type {String}
 */
enyo.singleton({
	name: "Master.lang.zh",
	kind: null,
	// menu items
	menu: {
		SIGN_IN:"登陆",
		REGISTER:"注册"
	},
	// titles
	title: {
		APP_NAME: "ENYO 应用程序！",
		LOGO_TEXT: "Developer Platform - 平安付",
		API_CATALOG:"API分类",
		API_DESCRIPTION:"概述",
		API_REQUEST: "请求",
		API_RESPONSE: "响应",
		API_EXAMPLES: "示例",
		API_REQUEST_EXAMPLE: "请求示例",
		API_RESPONSE_EXAMPLE: "响应示例",
		API_REQUEST_HEADERS: "请求头",
		API_RESPONSE_HEADERS: "响应头",
		API_REQUEST_PARAMS:"接口参数"
	},
	// navgator links.
	nav: {
		HOME: "首页",
		OFFICIAL_SITE: "平安官网"
	},
	//arbitrary page content
	content: {

	},
	// table legend labels
	legend: {

	},
	// form labels
	label: {
		REFINE_SEARCH: "搜索选项"
	},
	// button labels
	button: {
		SEARCH: "搜索"
	},
	// tooltips
	tooltip: {

	},
	// place holders
	placeholder: {
		SEARCH_HINT: "请输入API名字！"
	},
	// form field validation messages
	validationMsg: {

	},
	// messages
	message: {
		"SUCCESS": "成功了!",
		"HTTP_404": "404 服务不存在!",
		"HTTP_500": "500 内部错误!",
		"HTTP_405": "方法不被允许!",
		"LOAD_CATEGORIES": "加载API分类列表...",
		"LOAD_CATEGORY_DETAIL": "加载API详情..."
	}
});