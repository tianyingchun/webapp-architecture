enyo.kind({
	name: "Master.controllers.ProfileController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport",
		"Master.controllers.CategoryTreeSupport"
	],
	published: {
		security: true
	},
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
	apiList: function (apiKey) {
		this.zLog("api children list of current api id: ",apiKey);
		this.showProfileDockMenus({menuKey: "api_list"});
		this.bindingViewToContent(this.PROFILE_API_LIST, null, null);

		// fetch api list.
		this.fetchApiList(apiKey);
	},
	apiPagedList: function (apiKey, page) {
		this.zLog("api paged list: apiKey, page,", apiKey, page);

	},
	fetchApiList: function (apiKey, page) {
		// loading api list.
		var viewData = {
			action: "showApiListUI",
			data: {page: page || 1}
		};
		if (isNaN(page)) {
			viewData.data.page = 1;
		}
		var apiItemModel = this.getApiItemModel({key: apiKey});
		apiItemModel.getApiDetailByKey(apiKey, this.bind("showApiListUI", viewData));

	},
	/**
	 * Action methods add new api information
	 */
	addNewApi: function () {
		this.zLog("add new"); 

		// show profile.
		this.showProfileDockMenus({menuKey: "api_new"});
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
		this.showProfileDockMenus({menuKey: "api_edit"});
		this.bindingViewToContent(this.PROFILE_API_EDIT, null, null);
		var spinner_uid = Master.view.frame.showSpinnerPopup({
			message: "Loading...",
			classes:"white"
		});
		var apiItemModel = this.getApiItemModel({key: apiKey});
		apiItemModel.getApiDetailByKey(apiKey, this.bind("_loadingExistApiDetail", spinner_uid));
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
	deleteApiItem: function (inSender, inEvent) {
		var apiId = inEvent.id;
		var apiKey = inEvent.key;
		var parentId = inEvent.parentId;
		// indicating default if force redirect to parent node details.
		var redirectToParent = inEvent.redirectToParent;

		var apiItemModel = this.getApiItemModel({key: apiKey});
		apiItemModel.destroyApi(apiId, this.bind("_destroyApiItemComplete", parentId, redirectToParent));
		return true;
	},
	_destroyApiItemComplete: function (parentId, redirectToParent, viewModel) {
		if(viewModel.restInfo.retCode == 1) {
			// notify update dock profiles category tree.
			enyo.Signals.send("onTreeMenuUpdated");
			if (redirectToParent) {

				if (parentId != 0) {
					var spinnerId = Master.view.frame.showSpinnerPopup({classes:"white", message:"获取父节点..."});

					var apiItemModel = this.getApiItemModel({id: parentId});

					apiItemModel.getApiDetailById(parentId, function (viewModel) {
						Master.view.frame.hideSpinnerPopup(spinnerId);
						var key = viewModel.get("key");
						var hash = "#profile/node/"+key;
						if (viewModel.get("children").length) {
							hash = "#profile/node/list/"+key;
						}
						window.location.href= hash;
					});
				} else {
					window.location.href = "#profile";
				} 
				
			} else {
				// do refresh category list.
				this.fetchApiList(parentId);
			}
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
			var _apiItemModel = this.getApiItemModel({key: apiData.key});
			_apiItemModel.updateApiInfo(apiData, this.bind("_updateApiInfoComplete"));
		} else {
			var _apiItemModel = this.getApiItemModel({key: ""});
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