/**
 * @class singleton instance Master.lang.en
 * enlish locale resource.
 * @type {String}
 */
enyo.singleton({
	name: "Master.lang.en",
	kind: null,
	// menu items
	menu: {
		"SIGN_IN":"Log in",
		"REGISTER":"Register",
		"API_LIST": "API List"
	},
	// titles
	title: {
		"APP_NAME": "ENYO APP DEMO",
		"LOGO_TEXT": "Developer Platform - 1 Wallet",
		"API_CATALOG":"API Catalog",
		"API_DESCRIPTION":"Summary",
		"API_REQUEST": "Request",
		"API_RESPONSE": "Response",
		"API_EXAMPLES": "Example",
		"API_QUESTIONS": "Questions & Answers",
		"API_REQUEST_EXAMPLE": "Request Example",
		"API_RESPONSE_EXAMPLE": "Response Example",
		"API_REQUEST_HEADERS": "Request Headers",
		"API_RESPONSE_HEADERS": "Reponse Headers",
		"API_REQUEST_PARAMS":"API Arguments"
	},
	nav: {
		"HOME": "Home",
		"OFFICIAL_SITE": "PingAn China"
	},
	//arbitrary page content
	content: {
		// for api interface parameters
		"TABLE_API_PARAMS_NAME": "Field",
		"TABLE_API_PARAMS_VALUE": "Value",
		"TABLE_API_PARAMS_REQUIRED": "Is Required",
		"TABLE_API_PARAMS_DESC": "Description"
		// 
	},
	// table legend labels
	legend: {

	},
	// form labels
	label: {
		"REFINE_SEARCH": "Refine your search",
		"TABLE_API_QUESTION":"Q: ",
		"TABLE_API_ANSWER":"A: ",
		"ACTION_ADD": "Add New",
		"ACTION_EDIT": "Edit",
		"ACTION_REMOVE": "Remove",
		"ACTION_SUBMIT":"Submit",
		"ACTION_RESET" : "Reset"
	},
	// button labels
	button: {
		"SEARCH": "Search"
	},
	// tooltips
	tooltip: {

	},
	// place holders
	placeholder: {
		"SEARCH_HINT": "Type keywords to search!"
	},
	// form field validation messages
	validationMsg: {

	},
	// messages
	message: {
		"SUCCESS": "successfull!",
		"HTTP_404": "404 not found!",
		"HTTP_500": "500 internal error!",
		"HTTP_405": "405 Method Not Allowed!",
		"LOAD_CATEGORIES": "Loading categroies....",
		"LOAD_CATEGORY_DETAIL": "Loading api details...",
		"LOAD_PORFILE_MENUS": "Loading profile menus...",
		"LOAD_API_LIST": "Loading api list..."
	}
});