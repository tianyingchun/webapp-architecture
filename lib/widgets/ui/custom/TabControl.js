enyo.kind({
	name: "widgets.custom.TabControl",
	classes: "tab-control enyo-fit",
	mixins:[
		"Master.ClassSupport"
	],
	published: {
		// {name:"", text:"", link:"",selected: true, content:""}
		itemSource: []
	},
	components: [
		{name:"header", id:"header-items"},	
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{name: "scroller", touch:true, thumb:false, horizontal:"hidden", kind: "Scroller", classes:"enyo-fit scroller", components: [
            { name:"content", allowHtml:true, content:""}
        ]}
	],
	// designed to save lastest selected header item key.
	selectedItemKey: "",

	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
		};
	}),
	rendered:enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.itemSourceChanged();
		};	
	}),
	itemSourceChanged: function (oldValue) {
		var _itemSource = this.itemSource;
		this.zLog("itemSource: ", _itemSource);
		if (_itemSource.length) {
			var  _components = [];
			for (var i = 0; i < _itemSource.length; i++) {
			 	var item = _itemSource[i];
			 	var componentItem = { tag:"a", attributes: {href: item.link}, content: item.text };
			 	if (item.selected) {
			 		// save current default selected key.
			 		this.selectedItemKey = item.name;

			 		componentItem.classes = "item selected";
			 	} else {
			 		componentItem.classes = "item";
			 	}
			 	_components.push(componentItem);	
			};
			// make sure that the default select item key exists
			this.selectedItemKey = this.selectedItemKey || _itemSource[0].name;

			this.$.header.destroyClientControls();
			this.$.header.createClientComponents(_components);
			this.$.header.render();
			// show tab content
			this.showTabContent();
		}
		 // show.
		this.show();
	},
	// @private method
	showTabContent: function () {
		var selectedContent = "";
		if (this.itemSource.length) {
			for (var i = 0; i < this.itemSource.length; i++) {
				var item = this.itemSource[i];
				if (item.name == this.selectedItemKey) {
					selectedContent = item.content;
					break;
				}
			};
			selectedContent = selectedContent || this.itemSource[0].content;
		}
		this.$.content.destroyClientControls();
		this.$.content.createClientComponents([{ classes:"tab-content", allowHtml:true, content: selectedContent}]);
		this.$.content.render();
	},
	getTabControlWidth: function () {
		return this.getBounds().width || 0;
	},
	//@public
	show: function () {
		if (this.itemSource.length) {
			this.fireAnimationStart(0, this.getMaxWidth());
		} else {
			this.zLog("no header items don't show this panel.")
		}
	},
	hide: function () {
		if (this.itemSource.length) {
			this.fireAnimationStart(this.getMaxWidth(), 0);
		}
	},
	//@protected.
	fireAnimationStart: function (startValue, endValue) {
		if (this.$.animator) {
			if (this.$.animator.isAnimating()) {
				this.animatorComplete();
			}
			this.$.animator.stop();
			if (this.hasNode()) {
				this.$.animator.play({
					startValue: startValue,
					endValue: endValue
				});
			}
		}
	},
	getMaxWidth: function (){
		return this.getBounds().width;
	},
	animatorStep: function(inSender) {
		var fraction = inSender.value;
		this.zLog("fraction: ",fraction);
		this.stepTransition(fraction);
		return true;
	},
	animatorComplete: function() {
		if (this.$.animator.isAnimating()) {
			this.$.animator.stop();
		}
		this.finishTransition(true);
		return true;
	},
	// gambit: we interpolate between arrangements as needed.
	stepTransition: function(fraction) {
		if (this.hasNode()) {
			var marginLeft = this.getComputedStyleValue("margin-left", 0);
			this.applyStyle("margin-left",marginLeft + fraction);
		}
	},
	finishTransition: function(sendEvents) {
		this.transitionPoints = [];
		this.fraction = 0;
	}
});