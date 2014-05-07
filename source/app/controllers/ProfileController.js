enyo.kind({
	name: "Master.controllers.ProfileController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport",
		"Master.controllers.CategoryTreeSupport"
	],
	handlers:{
		// add/update
		"onSaveApiInformation":"saveApiInformationHandler",
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
		PROFILE_API_EDIT: "profile.ApiEdit"
	},
	/**
	 * Action method for all paged api list.
	 * @param  {number} page the page index
	 */
	apiList: function (apiId) {
		this.zLog("api children list of current api id: ",apiId);
		this.showProfileDockMenus({menuKey: "api_list"});
		this.bindingViewToContent(this.PROFILE_API_LIST, null, null);

		// fetch api list.
		this.fetchApiList(apiId);
	},
	apiPagedList: function (apiId, page) {
		this.zLog("api paged list: apiId, page,", apiId, page);

	},
	fetchApiList: function (apiId, page) {
		// loading api list.
		var viewData = {
			action: "showApiListUI",
			data: {page: page || 1}
		};
		if (isNaN(page)) {
			viewData.data.page = 1;
		}
		var apiItemModel = this.getApiItemModel({id: apiId});
		apiItemModel.getApiDetailById(apiId, this.bind("showApiListUI", viewData));

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
		this.showProfileDockMenus({menuKey: "api_list"});
		this.bindingViewToContent(this.PROFILE_API_EDIT, null, null);
		var spinner_uid = Master.view.frame.showSpinnerPopup({
			message: "Loading...",
			classes:"white"
		});
		var apiItemModel = this.getApiItemModel({id: apiId});
		apiItemModel.getApiDetailById(apiId, this.bind("_loadingExistApiDetail", spinner_uid));
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
		var categoryModel = this.getCollectionInstance("Master.models.apipool.Categories");
		var viewData = {
			action: "showCategoriesUI", // view action.
			data: {page: page || 1}
		};
		if (isNaN(page)) {
			viewData.data.page = 1;
		}
		categoryModel.getApiCategories(this.bind("_showCategoryListUI", viewData));
	},
	//@private helper method for render view model into corresponding view.
	_showCategoryListUI: function (viewData, viewModel) {
		this.notifyView(this.PROFILE_CATEGORY_LIST, viewModel, viewData);

	},
	deleteApiItem: function (inSender, inEvent) {
		var apiId = inEvent.id;
		var apiKey = inEvent.key;
		var parentId = inEvent.parentId;
		var apiItemModel = this.getApiItemModel({id: apiId});
		apiItemModel.destroyApi(apiId, this.bind("_destroyApiItemComplete", parentId));
		return true;
	},
	_destroyApiItemComplete: function (parentId, viewModel) {
		if(viewModel.restInfo.retCode == 1) {
			// notify update dock profiles category tree.
			enyo.Signals.send("onTreeMenuUpdated");
			// do refresh category list.
			this.fetchApiList(parentId);
		} else {
			Master.view.frame.showAlertDialog({
				title: "删除API",
				message:"删除API失败, "+ viewModel.restInfo.retMessage
			});
		}
	},
	// show profile dock menus.
	showProfileDockMenus: function (data) {
		// hide tabcontrol.
		//  profile page.
		Master.view.frame.addClass("profile");
		if (!Master.view.frame.hasProfileContentInDock()) {
			this.showProfileMenus(data);
		}
	},
	saveApiInformationHandler: function (inSender, inEvent) {
		var apiData = inEvent.data;
		var _editModel = inEvent.editModel;
		if(_editModel) {
			var _apiItemModel = this.getApiItemModel({id: apiData.id});
			_apiItemModel.updateApiInfo(apiData, this.bind("_updateApiInfoComplete"));
		} else {
			var _apiItemModel = this.getApiItemModel({id: ""});
			_apiItemModel.addNewApi(apiData, this.bind("_addNewApiComplete"));
		}
		return true;
	},
	_updateApiInfoComplete: function (viewModel) {
		var _message = "修改API 信息成功!";
		if(viewModel.restInfo.retCode!=1) {
			_message = viewModel.restInfo.retMessage;
		} else {
			enyo.Signals.send("onTreeMenuUpdated");
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
		} else {
			enyo.Signals.send("onTreeMenuUpdated");
		}
		Master.view.frame.showAlertDialog({
			title: "添加API",
			message:_message
		});
	},
	getApiItemModel: function (opts){
		return this.getModelInstance("Master.models.apipool.ApiItem", opts);
	}
});