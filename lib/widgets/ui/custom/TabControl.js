enyo.kind({
	name: "widgets.custom.TabControl",
	classes: "tab-control enyo-fit",
	mixins:[
		"Master.ClassSupport",
		"Master.HistorySupport"
	],
	published: {
		// {name:"", text:"", link:"",selected: true, content:""}
		itemSource: [],
		// used to save current control animation distance.
		offsetDistance : 300,
		//indicates current is slided shown. true is shown status.
		slideshown: false,
		// margin left for tab control percentage 81%
		marginLeft: "0%",

		autoSlide: false,
	},
	events:{
		// while the animation executing, can notify obsevers
		onTransitionStep: ""
	},
	components: [
		{name:"header", id:"header-items", components: [
			{name:"grabber", classes:"header-grabber",  ontap: "toggleShowHidden", kind: "onyx.Grabber"},
			{name:"headerItems", classes:"item-container", ontap:"changeSdkLanguage"}
		]},	
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{name: "scroller", touch:true, thumb:false, horizontal:"hidden", kind: "Scroller", classes:"enyo-fit scroller", components: [
            { name:"content", allowHtml:true, content:""}
        ]}
	],
	// designed to save lastest selected header item key.
	selectedItemKey: "",
	// used to save initlized control position
	originalPosition: {
		left: 0,
		top: 0,
		width: 0,
		marginLeft: 0
	},
	// used to save current tab control last position.
	lastPosition:{
		left: 0,
		top: 0,
		width: 0,
		marginLeft: 0
	},
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// initilized position for this control.
			this.initializeControlStatus();
		};
	}),
	itemSourceChanged: function (oldValue) {
		var _itemSource = this.itemSource;
		this.zLog("itemSource: ", _itemSource);
		if (!_itemSource.length) {
			this.zWarn("itemSource can't be an empty!");
		}
		var  _components = [];
		for (var i = 0; i < _itemSource.length; i++) {
		 	var item = _itemSource[i];
		 	var componentItem = {tag:"span", key:item.name, link:item.link, content: item.text };
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
		this.$.headerItems.destroyClientControls();
		this.$.headerItems.createClientComponents(_components);
		this.$.headerItems.render();
		// show tab content
		this.showTabContent();
		// reset postion of current control.
		this.resetControlStatus();

		// if current control status is shown, do nothing.
		if (this.autoSlide && !this.slideshown) {
			 // auto show this control.
			this.toggleShowHidden();
		}
	},
	// @private method
	showTabContent: function (itemKey) {
		this.selectedItemKey = itemKey || this.selectedItemKey;
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
	// while each time we set the itemsource for this control, we need to reset the positon to control initilized status.
	// @private
	resetControlStatus: function () {
		// now remove margin-left styles.
		this.lastPosition = enyo.clone(this.originalPosition);
		// restore orignal ui interface.
		if (this.slideshown) {
			this._saveLastControlPosition();
		}
	},
	//@private save orignal position for current control
	_saveOrignalControlPostion: function () {
		this.originalPosition.marginLeft = parseInt(this.getComputedStyleValue("margin-left", 0));
		// save current control postion.
		var bounds = this.getBounds();
		this.originalPosition.left = bounds.left;
		this.originalPosition.top = bounds.top;
		this.originalPosition.width = bounds.width;

	},
	//@private save last position for current control
	_saveLastControlPosition: function () {
		this.lastPosition.marginLeft = parseInt(this.getComputedStyleValue("margin-left", 0));
		// save current control postion.
		var bounds = this.getBounds();
		this.lastPosition.left = bounds.left;
		this.lastPosition.top = bounds.top;
		this.lastPosition.width = bounds.width;
	},
	initializeControlStatus: function () {
		this._saveOrignalControlPostion();
		// save last postion for current control.
		this.lastPosition = enyo.clone(this.originalPosition);
		// calculate the tab control header width.
	},
	toggleShowHidden: function (inSender, inEvent) {
		if (this.slideshown) {
			this.hide();
		} else {
			this.show();
		}
		return true;
	},
	changeSdkLanguage: function (inSender, inEvent) {
		// this.zLog("inEvent", inEvent);
		var linkItem = inEvent.originator;

		var language = "";
		if (linkItem) {
			language = linkItem.get("key");
		}
		// save current user prefered api language 
		this.saveUserApiLanguage(language);

		var controls = inSender.getControls();
		for (var i = 0; i < controls.length; i++) {
			var control = controls[i];
			control.removeClass("selected");
		};
		linkItem.addClass("selected");

		this.showTabContent(language);

		return true;
	},
	reflow: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			enyo.job("widget_tabcontrol_reflow", this.bindSafely("reflowControlLayout"),100);
		};	
	}),
	reflowControlLayout: function (inEvent) {
		var $parentNode = this.parent;
		var parentWidth = $parentNode.getBounds().width || enyo.dom.getWindowWidth();
		var marginLeft = (parseFloat(this.marginLeft) / 100.0) * parentWidth;
		var moveDistance = marginLeft;
		if (this.slideshown) {
			moveDistance = (marginLeft - this.offsetDistance);
		}
		this.applyStyle("margin-left", moveDistance + "px");
		this.initializeControlStatus();
		this.resetControlStatus();
	},
	//@public
	show: function () {
		if (this.itemSource.length) {
			this.fireAnimationStart(0, this.offsetDistance);
		} else {
			this.zLog("no header items don't show this panel.")
		}
	},
	hide: function () {
		if (this.itemSource.length) {
			this.fireAnimationStart(0, this.offsetDistance);
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
	animatorStep: function(inSender) {
		var fraction = inSender.value;
		// this.zLog("fraction: ",fraction);
		this.stepTransition(fraction);
		return true;
	},
	animatorComplete: function() {
		if (this.$.animator.isAnimating()) {
			this.$.animator.stop();
		}
		this.finishTransition();
		return true;
	},
	// gambit: we interpolate between arrangements as needed.
	stepTransition: function(fraction) {
		if (this.hasNode()) {
			var move = this.calcAnimationMove(fraction);
			// bubble events.
			this.doTransitionStep({fraction: fraction, slideshown: this.slideshown});
			this.applyStyle("margin-left",move.marginLeft +"px");
			this.applyStyle("width", move.width +"px");
		}
	},
	//@procted, we can override this method to implemente different animation effections.
	calcAnimationMove: function (fraction) {
		// get current runtime margin left
		var marginLeft = this.lastPosition.marginLeft;
		var width = this.lastPosition.width;
		if (this.slideshown) {
			// exec show control.
			marginLeft += fraction; 
			width -=fraction;
		} else {
			marginLeft -= fraction;
			width +=fraction;
		}
		var move = {
			marginLeft: marginLeft,
			width: width
		};
		// this.zLog("animator move: ", move);
		return move;
	},
	finishTransition: function() {
		this.slideshown = !this.slideshown;
		this._saveLastControlPosition();
	}
});