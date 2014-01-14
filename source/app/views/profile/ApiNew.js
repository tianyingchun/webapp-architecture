enyo.kind({
	name: "Master.views.profile.ApiNew",
	kind: "Master.View",
	classes: "api-new",
	components: [
		{name: "container", classes:"api-container", components: [
			{name:"form", kind:"widgets.forms.FormDecorator", components: [
				{name:"apiName", kind:"widgets.forms.InputDecorator", validation: {required:"message"}}
			]},
			{name:"textEditor", kind: "Master.TextEditor"},
		]}
	],
	handlers:{
		ontap: "formActionButtonTap"
	},
	receiveMessage: enyo.inherit(function(sup) {
		return function (viewModel, viewData) {
			sup.apply(this, arguments);
			// do nothing now..
			var viewAction  = viewData.action;
			var extraData = viewData.data;
			var viewActionFn = viewAction && this[viewAction];
			if (viewActionFn) {
				viewActionFn.call(this, viewModel, extraData);
			} else {
				this.zWarn("viewActionFn don't exist!");
			}
		}
	}),
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// add form customized button.
			this.$.form.set("toolButtonConfig", {
				first: {
					content: Master.locale.get("ACTION_SUBMIT", "label"),
					show: true
				}
			});
		};
	}),
	showAddNewApiUI: function () {
		this.$.textEditor.markItUp();
	},
	formActionButtonTap: function (inSender, inEvent) {
		var originator = inEvent.originator;
		switch(originator.action) {
			case "first":
				this.addNewApi(inSender, inEvent);
				break;
			case "second":
				this.resetNewApi(inSender, inEvent);
				break;
		}
	},
	// button handler for creating new api
	addNewApi: function (inSender, inEvent) {
		var editorText = this.$.textEditor.getEditorContent();
		this.zLog("add new text:", editorText);
		this.$.form.submit();
		return true;
	},
	resetNewApi: function (inSender, inEvent) {
		this.zLog("reset text:", inEvent);
		return true;
	}
});