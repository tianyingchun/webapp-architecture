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
		"API_LIST": "API List",
		"CATEGORY_LIST":"API Categories"
	},
	// titles
	title: {
		"APP_NAME": "ENYO APP DEMO",
		"LOGO_TEXT": "Developer Platform Api Browser",
		"API_CATALOG":"API Catalog",
		"API_DESCRIPTION":"Summary",
		"API_REQUEST": "Request",
		"API_RESPONSE": "Response",
		"API_EXAMPLES": "Example",
		"API_QUESTIONS": "Questions & Answers",
		"API_REQUEST_EXAMPLE": "Request Example",
		"API_RESPONSE_EXAMPLE": "Response Example",
		"API_REQUEST_HEADERS": "Request Headers",
		"API_REQUEST_PAYLOAD": "Payload",
		"API_RESPONSE_HEADERS": "Reponse Headers",
		"API_RESPONSE_BODY": "Response Result",
		"API_REQUEST_PARAMS":"API Arguments",
		"API_RESPONSE_PARAMS": "Response Comments",
		"DIALOG_ALERT_ERROR":"Alert Error"
	},
	nav: {
		"HOME": "Home",
		"OFFICIAL_SITE": "PingAn China"
	},
	//arbitrary page content
	content: {
		// for api interface parameters
		"TABLE_API_PARAMS_NAME": "Field",
		"TABLE_API_PARAMS_NAMEDESC": "Field Desc",
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
		"ALLOWEMPTY":"",//该字段允许为空
		"REQUIRED": "it's required field!",
		"EMAIL": "email format is not correct!",
		"HASH": "format incorrect the character only can be [a-z,A-Z,0-9,-_%]",
		"DROPDOWNLIST":"please choose one item!"
	},
	// messages
	message: {
		"SUCCESS": "successfull!",
		"HTTP_404": "404 not found!",
		"HTTP_500": "500 internal error!",
		"HTTP_405": "405 Method Not Allowed!",
		"HTTP_400": "400 Bad request!",
		"LOAD_CATEGORIES": "Loading categroies....",
		"LOAD_CATEGORY_DETAIL": "Loading api details...",
		"LOAD_PORFILE_MENUS": "Loading profile menus...",
		"LOAD_API_LIST": "Loading api list..."
	}
});