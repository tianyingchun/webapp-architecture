enyo.kind({
	name: "Master.controllers.ProfileController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport"
	],
	handlers:{
		"onFetchApiAvailableCategories":"fetchApiAvailableCategories",
		"onCommitCategory":"addNewCategoryHandler",
		"onSaveApiInformation":"saveNewApiHandler"
	},
	// defined constants here.
	constants: {
		//  assign constants onto the current controller instance.
		PROFILE_CATEGORY_EDIT:"profile.CategoryEdit",
		// api list view
		PROFILE_API_LIST: "profile.ApiList",
		// api add new view
		PROFILE_API_NEW: "profile.ApiNew",
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
	editApi:function(apiId) {
		this.zLog("apiId: ", apiId);
		this.showProfileDockMenus({menuKey: "list"});
	},
	removeApi: function (apiId) {
		this.zLog("apiId:", apiId);
		this.showProfileDockMenus({menuKey: "list"});
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
		var categoryModel = new Master.models.apipool.Categories();
		categoryModel.getApiCategories(this.bindSafely("_showAvailableCategories"));
	},
	// show available categories.
	_showAvailableCategories: function (viewModel){
		this.notifyView(this.PROFILE_API_NEW,viewModel, {
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
	editCategory: function (categoryId) {
		this.zLog("categoryId: ", categoryId);
		this.showProfileMenus({menuKey: "category_list"});
		// show edit category ui.
		this.bindingViewToContent(this.PROFILE_CATEGORY_EDIT, null, null);
		
		// get category data.
		var categoryItemModel = this.getCategoryItemModel();

		// go to get
		categoryItemModel.getCategoryDetail(categoryId, this.bindSafely("_showCategoryEditDetail"));
		
	},
	_showCategoryEditDetail: function (viewModel) {
		// show edit cagtegory ui.
		this.notifyView(this.PROFILE_CATEGORY_EDIT, viewModel, {
			action: "showEditCategoryUI"
		});
	},
	/**
	 * remove specific cateogry
	 * @param  {string} categoryId the category key.
	 */
	removeCategory: function (categoryId) {

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
	addNewCategoryHandler: function (inSender, inEvent) {
		this.zLog("new category data: ", inEvent);
		var data = inEvent.data;
		var categoryItemModel = this.getCategoryItemModel();
		categoryItemModel.addNewCategory(data, this.bindSafely("_addNewCategoryComplete"));
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
	saveNewApiHandler: function (inSender, inEvent) {
		var _apiItemModel = this.getApiItemModel();
		var apiData = inEvent.data;
		_apiItemModel.addNewApi(apiData, this.bindSafely("_addNewApiComplete"));
		return true;
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
	getApiItemModel: function (){
		if(!this._apiItemModel) {
			this._apiItemModel = new Master.models.apipool.ApiItem();
		}
		return this._apiItemModel;
	},
	//@private get category item model.
	getCategoryItemModel: function () {
		if(!this._categoryItemModel ){
			this._categoryItemModel = new Master.models.apipool.CategoryItem();
		}
		return this._categoryItemModel;
	}
});