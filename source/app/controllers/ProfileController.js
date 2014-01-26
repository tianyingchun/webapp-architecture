enyo.kind({
	name: "Master.controllers.ProfileController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport"
	],
	handlers:{
		"onFetchApiAvailableCategories":"fetchApiAvailableCategories",
		// add/update
		"onCommitCategory":"saveCategoryInfoHandler",
		"onSaveApiInformation":"saveApiInformationHandler",
		// delete category item.
		"onDeleteCategoryItem": "deleteCategoryItem",
		// desctroy api item.
		"onDeleteApiItem":"deleteApiItem"
	},
	// defined constants here.
	constants: {
		//  assign constants onto the current controller instance.
		// api list view
		PROFILE_API_LIST: "profile.ApiList",
		// api add new view
		PROFILE_API_NEW: "profile.ApiNew",
		//api edit 
		PROFILE_API_EDIT: "profile.ApiEdit",

		PROFILE_CATEGORY_EDIT:"profile.CategoryEdit",
		// category list view
		PROFILE_CATEGORY_LIST: "profile.CategoryList",
		// category add new view.
		PROFILE_CATEGORY_NEW:"profile.CategoryNew"
	},
	/**
	 * Action method for all paged api list.
	 * @param  {number} page the page index
	 */
	apiList: function (page) {
		this.zLog("api list current page: ", page);
		this.showProfileDockMenus({menuKey: "api_list"});
		this.bindingViewToContent(this.PROFILE_API_LIST, null, null);

		// fetch api list.
		this.fetchApiList();
	},
	fetchApiList: function () {
		// loading api list.
		var apiList = new Master.models.apipool.ApiList();
		var viewData = {
			action: "showApiListUI",
			data: {page: page || 1}
		};
		if (isNaN(page)) {
			viewData.data.page = 1;
		}
		apiList.getApiList(enyo.bindSafely(this, "showApiListUI", viewData));
	},
	/**
	 * Action methods add new api information
	 */
	addNewApi: function () {
		this.zLog("add new");
		// show profile.
		this.showProfileDockMenus({menuKey: "api_list"});
		this.bindingViewToContent(this.PROFILE_API_NEW, null, null);
		var viewModel = {
			restInfo: {
				retCode: 1
			}
		};
		this.notifyView(this.PROFILE_API_NEW, viewModel, {
			action:"showAddNewApiUI"
		});
	},
	editApi:function(apiKey) {
		this.zLog("apiKey: ", apiKey);
		this.showProfileDockMenus({menuKey: "api_list"});
		this.bindingViewToContent(this.PROFILE_API_EDIT, null, null);
		var spinner_uid = Master.view.frame.showSpinnerPopup({
			message: "Loading Api detail..."
		});
		var apiItemModel = this.getApiItemModel({apiKey: apiKey});
		apiItemModel.getApiDetail(apiKey, this.bindSafely("_loadingExistApiDetail", spinner_uid));
	},
	_loadingExistApiDetail: function(spinner_uid, viewModel) {
		this.notifyView(this.PROFILE_API_EDIT, viewModel,{
			action: "loadingExistApiDetailUI",
			data: {
				spinner_uid: spinner_uid
			}
		});
	},
	showApiListUI: function (viewData, viewModel) {
		this.notifyView(this.PROFILE_API_LIST, viewModel, viewData);
	},
	/**
	 * list all categories
	 * @param  {number} page the current category list page
	 */
	categoryList: function (page) {
		this.zLog("category list current page: ", page);
		this.showProfileDockMenus({menuKey: "category_list"});
		// binding view first.
		this.bindingViewToContent(this.PROFILE_CATEGORY_LIST, null, null);
		// fetch category list data.
		this.fetchCategoryList();
	},
	fetchCategoryList: function () {
		var categoryModel = new Master.models.apipool.Categories();
		var viewData = {
			action: "showCategoriesUI", // view action.
			data: {page: page || 1}
		};
		if (isNaN(page)) {
			viewData.data.page = 1;
		}
		categoryModel.getApiCategories(this.bindSafely("_showCategoryListUI", viewData));
	},
	//@private helper method for render view model into corresponding view.
	_showCategoryListUI: function (viewData, viewModel) {
		this.notifyView(this.PROFILE_CATEGORY_LIST, viewModel, viewData);

	},
	fetchApiAvailableCategories: function(inSender, inEvent){
		var isEditModel = inEvent.editModel;
		var categoryModel = new Master.models.apipool.Categories();
		categoryModel.getApiCategories(this.bindSafely("_showAvailableCategories", isEditModel));
	},
	// show available categories.
	_showAvailableCategories: function (isEditModel, viewModel){
		var _viewName = isEditModel ? this.PROFILE_API_EDIT:this.PROFILE_API_NEW;
		this.notifyView(_viewName, viewModel, {
			action:"showAvalilableCategories" // defined in view.
		});
	},
	/**
	 * Add new category
	 */	
	addNewCategory: function () {
		this.showProfileDockMenus({menuKey: "category_list"});
		this.bindingViewToContent(this.PROFILE_CATEGORY_NEW, null, null);
		var viewModel = {
			restInfo: {
				retCode: 1
			}
		};
		this.notifyView(this.PROFILE_CATEGORY_NEW, viewModel, {
			action:"showAddNewCategoryUI"
		});
	},
	/**
	 * Edit exist category information
	 * @param  {string} categoryId the category key.
	 */
	editCategory: function (categoryKey) {
		this.zLog("categoryKey: ", categoryKey);
		this.showProfileMenus({menuKey: "category_list"});
		// show edit category ui.
		this.bindingViewToContent(this.PROFILE_CATEGORY_EDIT, null, null);
		// get category data.
		var categoryItemModel = this.getCategoryItemModel({categoryKey: categoryKey});
		// go to get
		categoryItemModel.getCategoryDetail(categoryKey, this.bindSafely("_showCategoryEditDetail"));
	},
	_showCategoryEditDetail: function (viewModel) {
		// show edit cagtegory ui.
		this.notifyView(this.PROFILE_CATEGORY_EDIT, viewModel, {
			action: "showEditCategoryUI"
		});
	},
	// delete category item.
	deleteCategoryItem: function (inSender, inEvent){
		var categoryId = inEvent.categoryId;
		var categoryKey = inEvent.categoryKey;
		var categoryModel = this.getCategoryItemModel({categoryKey: categoryKey});
		categoryModel.removeCategory(categoryId, this.bindSafely("_destroyCategoryComplete"));
		return true;
	},
	deleteApiItem: function (inSender, inEvent) {
		var apiId = inEvent.apiId;
		var apiKey = inEvent.apiKey;
		var apiItemModel = this.getApiItemModel({apiKey: apiKey});
		apiItemModel.destroyApi(apiId, this.bindSafely("_destroyApiItemComplete"));
		return true;
	},
	_destroyApiItemComplete: function (viewModel) {
		if(viewModel.restInfo.retCode == 1) {
			// do refresh category list.
			this.fetchApiList();
		} else {
			Master.view.frame.showAlertDialog({
				title: "删除分类",
				message:"删除分类失败, "+ viewModel.restInfo.retMessage
			});
		}
	},
	// show profile dock menus.
	showProfileDockMenus: function (data) {
		// hide tabcontrol.
		Master.view.frame.hideSDKPanel();
		//  profile page.
		Master.view.frame.addClass("profile");
		if (!Master.view.frame.hasProfileContentInDock()) {
			this.showProfileMenus(data);
		} else {
			// update the profule menu hightlight item.
			this.highlightProfileMenuItem(data);
		}
	},
	//@private add new category information 
	saveCategoryInfoHandler: function (inSender, inEvent) {
		this.zLog("saveCategoryInfo event: ", inEvent);
		var data = inEvent.data;
		var isEditModel = inEvent.isEditModel;
		var categoryKey = data.categoryKey;
		// edit model.
		if (isEditModel) {
			var categoryItemModel = this.getCategoryItemModel({categoryKey:categoryKey});
			categoryItemModel.updateCategoryInfo(data, this.bindSafely("_updateCategoryComplete"));
		} else {
			// Make sure tht new use the categoryKey=""
			var categoryItemModel = this.getCategoryItemModel({categoryKey:""});
			categoryItemModel.addNewCategory(data, this.bindSafely("_addNewCategoryComplete"));
		}
		return true;
	},
	_addNewCategoryComplete: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		var _message = "添加分类成功！";
		if(viewModel.restInfo.retCode!=1){
			// show add new successful.
			_message = viewModel.restInfo.retMessage;
		}
		Master.view.frame.showAlertDialog({
			title: "添加分类",
			message:_message
		});
	},
	_updateCategoryComplete: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		var _message = "更新分类成功！";
		if(viewModel.restInfo.retCode!=1){
			// show add new successful.
			_message = viewModel.restInfo.retMessage;
		}
		Master.view.frame.showAlertDialog({
			title: "更新分类",
			message:_message
		});
	},
	_destroyCategoryComplete: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		if(viewModel.restInfo.retCode == 1) {
			// do refresh category list.
			this.fetchCategoryList();
		} else {
			Master.view.frame.showAlertDialog({
				title: "删除分类",
				message:"删除分类失败, "+ viewModel.restInfo.retMessage
			});
		}
	},
	saveApiInformationHandler: function (inSender, inEvent) {
		var apiData = inEvent.data;
		var _editModel = inEvent.editModel;
		if(_editModel) {
			var _apiItemModel = this.getApiItemModel({apiKey: apiData.apiKey});
			_apiItemModel.updateApiInfo(apiData, this.bindSafely("_updateApiInfoComplete"));
		} else {
			var _apiItemModel = this.getApiItemModel({apiKey: ""});
			_apiItemModel.addNewApi(apiData, this.bindSafely("_addNewApiComplete"));
		}
		return true;
	},
	_updateApiInfoComplete: function (viewModel) {
		var _message = "修改API 信息成功!";
		if(viewModel.restInfo.retCode!=1) {
			_message = viewModel.restInfo.retMessage;
		}
		var _this = this;
		Master.view.frame.showAlertDialog({
			title: "修改API",
			message:_message,
			success:  function () {
				//_this.locationAdminApilist();
			}
		});
	},
	_addNewApiComplete: function (viewModel) {
		this.zLog("viewModel: ", viewModel);
		var _message = "添加新API 成功！";
		if(viewModel.restInfo.retCode!=1) {
			_message = viewModel.restInfo.retMessage;
		}
		Master.view.frame.showAlertDialog({
			title: "添加API",
			message:_message
		});
	},
	getApiItemModel: function (opts){
		return this.getModelInstance("Master.models.apipool.ApiItem", opts);
	},
	//@private get category item model.
	getCategoryItemModel: function (opts) {
		return this.getModelInstance("Master.models.apipool.CategoryItem", opts);
	}
});