enyo.kind({
	name:"widgets.layout.TwoColumnDivision",
	classes:"widgets-layout-twocolumn",
	published: {
		// left dock components
		leftDock:[],
		// right main content components
		rightContent: [],
		// the content holder configurations.
		config: {
			leftDock:"",
			rightContent: ""
		},
		// diable drag event.
		draggable: true,
		// the sepecificed miin width for leftdock, dragbar, maincontent.(px)
		minWidthConfig: {
			dock: 250,
			dragbar:8,
			content: 900
		},
		// the layout min-height property.
		minHeight: 400
	},
	mixins:[
		"Master.ClassSupport"
	],
	events:{
		onContainerRendered:""
	},
	handlers:{
		ondragstart: "dragstart",
		ondrag: "drag",
		ondragfinish: "dragfinish"
	},
	components: [
		{kind: "Animator", onStep: "step", onEnd: "completed"},
		{classes: "container-three",components: [
			{name:"containerDock", classes:"container-two", components: [
				{name:"containerOne", classes: "container-one", components: [
					{ name:"colDock", classes:"coldock-wrapper"},
					{ name:"dragbar", classes:"coldrag-handler"},
					{ name:"colContent", classes:"colmain-wrapper"}
				]}
			]}
		]}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.dragComponentName = "dragbar";
			this.leftDockChanged();
			this.rightContentChanged();
		};	
	}),
	//* @public
	setDockContent: function (content) {
		var dockName = (this.config && this.config.leftDock) || "colDock";
		var $dock = this.$[dockName];
		if($dock) {
			$dock.destroyClientControls();
			$dock.createClientComponents(content);
			$dock.render();
		} else {
			this.zError("can't find the specified left dock component!");
		}
	},
	//* @public
	setMainContent: function (content) {
		var contentName = (this.config && this.config.rightContent) || "colContent";
		var $colContent = this.$[contentName];
		$colContent.destroyClientControls();
		$colContent.createClientComponents(content);
		$colContent.render();
		// manully invoke reflow page layout to refresh page min-height.
		enyo.job("reflowPageLayout", this.bindSafely("reflowPageLayout"),100);
	},
	//* @public
	getDockControls: function () {
		return this.$.colDock.getControls();
	},
	//* @public
	getMainContentControls:function () {
		return this.$.colContent.getControls();
	},
	// * @publich
	updateStyles: function (style) {
		for(var item in style) { 
			this.$.dragbar.applyStyle(item, style[item]);
		}
	},
	leftDockChanged: function () {
		this.$.colDock.destroyClientControls();
		this.$.colDock.createClientComponents(this.leftDock);
		this.$.colDock.render();
	},
	rightContentChanged: function () {
		this.$.colContent.destroyClientControls();
		this.$.colContent.createClientComponents(this.rightContent);
		this.$.colContent.render();
	},
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// set minimal height for page body.
			this.reflowPageLayout();
		};
	}),
	// override reflow workflow.
	reflow: enyo.inherit(function (sup){
		return function () {
			sup.apply(this, arguments);
			// last resize event.
			// do our stuff here while resize window.
			enyo.job("reflowPageLayout", this.bindSafely("reflowPageLayout"),500);
		};
	}),
	// fresh the page body container layout
	reflowPageLayout: function () { 
		// adjust position for dock, dragbar,content control.
		this.adjustColumnPosition(); 
	},
	//* @private methods for animation.
	dragstart: function(inSender, inEvent) { 
		if (this.draggable && this.canAllowDrag(inEvent)) {
			inEvent.preventDefault();
			this.calcDragBarPosition();
			this.dragging = true; 
			return true;
		}
	},
	//*@ private calculate the new position for dragbar.
	calcDragBarPosition: function () {
		this.startPositionLeft =  this.$.dragbar.hasNode().getBoundingClientRect().left;
	},
	//* @private methods for controls.
	adjustColumnPosition: function () {
		// override css styles and update new control column positon with specified width.
		
		var w_min = this.minWidthConfig;
		 
		var p_dock = this.$.colDock.getBounds(),
			p_content = this.$.colContent.getBounds(),
			p_dragbar = this.$.dragbar.getBounds();
		var p_this = this.getBounds();
		// update min height for layout control.
		var dockHeight = p_dock.height, 
			mainContentHeight = p_content.height;

		var dockWidth = p_dock.width,
			mainContentWidth = p_content.width;

		var maxHeight = Math.max(dockHeight, mainContentHeight, this.minHeight); 
		// set layout min height.
		this.$.dragbar.applyStyle("height", maxHeight+"px");
		 
		this.$.colContent.applyStyle("width", (p_this.width - p_dock.width- p_dragbar.width)+"px");

		this.doContainerRendered({height:maxHeight});
	},
	// private check current element allow dragging.
	canAllowDrag: function (inEvent) {
		var originator = inEvent.originator;
		if(originator && originator.name == this.dragComponentName) {
			return true;
		} 
		return false;
	},
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			this.dragTransition(inEvent);
			return true;
		}
	},
	dragTransition: function(inEvent) {
		// only drag horizental direction.
		var v = this.calcKnobPosition(inEvent);
		return;
		var value = this.clampValue(this.min, this.max, v);
		var p = this.calcPercent(value);
		this.updatePosition(p);
	},
	calcKnobPosition: function(inEvent) {
		console.log(inEvent)
		// console.log(inEvent.clientX, 
		// 	this.$.colDock.hasNode().getBoundingClientRect(),
		// 	this.$.dragbar.hasNode().getBoundingClientRect(),
		// 	this.$.colContent.hasNode().getBoundingClientRect()
		// 	);
		 var newLeft  = -(this.startPositionLeft - inEvent.dx);
		 console.log("newLeft", newLeft);
		 this.$.dragbar.applyStyle("left", newLeft+"px");
		 return;
		var x = inEvent.clientX - this.$.dragbar.hasNode().getBoundingClientRect().left;
		return (x / this.$.dragbar.getBounds().width) * (this.max - this.min) + this.min;
	},
	updatePosition: function(inPercent) {
		//this.$.colDock.applyStyle("width", inPercent+"%");
		// this.zLog("step transition", inPercent);
	},
	calcPercent: function(inValue) {
		return this.calcRatio(inValue) * 100;
	},
	calcRatio: function(inValue) {
		return (inValue - this.min) / (this.max - this.min);
	},
	clampValue: function(inMin, inMax, inValue) {
		return Math.max(inMin, Math.min(inValue, inMax));
	},
	dragfinish: function(inSender, inEvent) {
		if (this.dragging) {
			this.dragging = false;
			inEvent.preventTap();
		}
	}
});