enyo.kind({
	name: "Master.controllers.ProfileController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport"
	],
	handlers:{
		"onCommitCategory":"addNewCategoryHandler"
	},
	// api list view
	_contentProfileApiListKindView: "profile.ApiList",
	// api add new view
	_contentProfileApiAddNewKindView: "profile.ApiNew",
	// category list view
	_contentProfileCategoryListKindView: "profile.CategoryList",
	// category add new view.
	_contentProfileCategoryAddNewKindView:"profile.CategoryNew",

	/**
	 * Action method for all paged api list.
	 * @param  {number} page the page index
	 */
	apiList: function (page) {
		this.zLog("api list current page: ", page);
		this.showProfileDockMenus({menuKey: "api_list"});
		this.bindingViewToContent(this._contentProfileApiListKindView, null, null);

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
		this.bindingViewToContent(this._contentProfileApiAddNewKindView, null, null);
		var viewModel = {
			restInfo: {
				retCode: 1
			}
		};
		this.notifyView(this._contentProfileApiAddNewKindView, viewModel, {
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
		this.notifyView(this._contentProfileApiListKindView, viewModel, viewData);
	},
	/**
	 * list all categories
	 * @param  {number} page the current category list page
	 */
	categoryList: function (page) {
		this.zLog("category list current page: ", page);
		this.showProfileDockMenus({menuKey: "category_list"});
		// binding view first.
		this.bindingViewToContent(this._contentProfileCategoryListKindView, null, null);
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
		this.notifyView(this._contentProfileCategoryListKindView, viewModel, viewData);

	},
	/**
	 * Add new category
	 */	
	addNewCategory: function () {
		this.showProfileDockMenus({menuKey: "category_list"});
		this.bindingViewToContent(this._contentProfileCategoryAddNewKindView, null, null);
		var viewModel = {
			restInfo: {
				retCode: 1
			}
		};
		this.notifyView(this._contentProfileCategoryAddNewKindView, viewModel, {
			action:"showAddNewCategoryUI"
		});
	},
	/**
	 * Edit exist category information
	 * @param  {string} categoryId the category key.
	 */
	editCategory: function (categoryId) {

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
	//@private get category item model.
	getCategoryItemModel: function () {
		if(!this.categoryItemModel ){
			this.categoryItemModel = new Master.models.apipool.CategoryItem();
		}
		return this.categoryItemModel;
	}
});