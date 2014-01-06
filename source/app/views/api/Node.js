enyo.kind({
	name: "Master.views.api.Node",
	kind: "Master.View",
	receiveMessage: function (viewModel, viewAction) {
		var restInfo = viewModel.restInfo;
		if (restInfo.retCode ==1) {
			// do nothing now..
			var viewActionFn = viewAction && this[viewAction];
			if (viewActionFn) {
				viewActionFn.call(this, viewModel);
			}
		} else {	
			alert(restInfo.retMessage);
		}
	}
});