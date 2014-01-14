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
		"SIGN_IN":"登陆",
		"REGISTER":"注册",
		"API_LIST": "API列表" 
	},
	// titles
	title: {
		"APP_NAME": "ENYO 应用程序！",
		"LOGO_TEXT": "平安付开发者平台",
		"API_CATALOG":"API分类",
		"API_DESCRIPTION":"概述",
		"API_REQUEST": "请求",
		"API_RESPONSE": "响应",
		"API_EXAMPLES": "示例",
		"API_QUESTIONS": "问题解答",
		"API_REQUEST_EXAMPLE": "请求示例",
		"API_RESPONSE_EXAMPLE": "响应示例",
		"API_REQUEST_HEADERS": "请求头",
		"API_RESPONSE_HEADERS": "响应头",
		"API_REQUEST_PARAMS":"接口参数"
	},
	// navgator links.
	nav: {
		"HOME": "首页",
		"OFFICIAL_SITE": "平安官网"
	},
	//arbitrary page content
	content: {
		// for api interface parameters
		"TABLE_API_PARAMS_NAME": "字段",
		"TABLE_API_PARAMS_VALUE": "取值",
		"TABLE_API_PARAMS_REQUIRED": "必填",
		"TABLE_API_PARAMS_DESC": "描述"
	},
	// table legend labels
	legend: {

	},
	// form labels
	label: {
		"REFINE_SEARCH": "搜索选项",
		// question & answer
		"TABLE_API_QUESTION":"问题: ",
		"TABLE_API_ANSWER":"回答: ",
		"ACTION_ADD": "添加",
		"ACTION_EDIT": "编辑",
		"ACTION_REMOVE": "删除",
		"ACTION_SUBMIT": "提交",
		"ACTION_RESET" : "重置"
	},
	// button labels
	button: {
		"SEARCH": "搜索"
	},
	// tooltips
	tooltip: {

	},
	// place holders
	placeholder: {
		"SEARCH_HINT": "请输入API名字！"
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
		"LOAD_CATEGORY_DETAIL": "加载API详情...",
		"LOAD_PORFILE_MENUS": "加载Profile菜单列表...",
		"LOAD_API_LIST": "加载API 列表信息..."
	}
});