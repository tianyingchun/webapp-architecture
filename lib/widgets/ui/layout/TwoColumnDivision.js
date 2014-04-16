enyo.kind({
	name:"widgets.layout.TwoColumnDivision",
	classes:"widgets-layout-twocolumn",
	events:{
		onContainerRendered:""
	},
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
		dockMinWidth: 220,
		dockMaxWidth: 600,
		// diable drag event.
		draggable: true,
		// the layout min-height property.
		minHeight: 400
	},
	mixins:[
		"Master.ClassSupport"
	],
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
					{ name:"colContent", classes:"colmain-wrapper", components: [
						{name:"colmain", classes:"col-main"}
					]}
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
		var contentName = (this.config && this.config.rightContent) || "colmain";
		var $colContent = this.$[contentName];
		if($colContent) {
			$colContent.destroyClientControls();
			$colContent.createClientComponents(content);
			$colContent.render();
		} else {
			this.zError("can't find the specified right content component!");
		}
		// manully invoke reflow page layout to refresh page min-height.
		enyo.job("reflowPageLayout", this.bindSafely("reflowPageLayout"),100);
	},
	//* @public
	getDockControls: function () {
		var dockName = (this.config && this.config.leftDock) || "colDock";
		var $dock = this.$[dockName];
		if($dock) {
			return $dock.getControls();
		} else {
			this.zError("can't find the specified left dock component!");
		}
	},
	//* @public
	getMainContentControls:function () {
		var contentName = (this.config && this.config.rightContent) || "colmain";
		var $colContent = this.$[contentName];
		if($colContent) {
			return $colContent.getControls();
		} else {
			this.zError("can't find the specified right content component!");
		}
	},
	// * @publich
	updateStyles: function (style) {
		for(var item in style) { 
			this.$.dragbar.applyStyle(item, style[item]);
			this.$.colContent.applyStyle(item, style[item]);
		}
	},
	leftDockChanged: function () {
		this.$.colDock.destroyClientControls();
		this.$.colDock.createClientComponents(this.leftDock);
		this.$.colDock.render();
	},
	rightContentChanged: function () {
		this.$.colmain.destroyClientControls();
		this.$.colmain.createClientComponents(this.rightContent);
		this.$.colmain.render();
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
	//*@ public
	reflowPageLayout: function () { 
		this.zLog("test relfow pagelayout execute counts..");
		// adjust position for dock, dragbar,content control.
		this.adjustColumnPosition(); 
	},
	//* @private methods for animation.
	dragstart: function(inSender, inEvent) { 
		if (this.draggable && this.canAllowDrag(inEvent)) {
			inEvent.preventDefault();
			this.calcDragPosition();
			this.dragging = true; 
			return true;
		}
	},
	//*@ private calculate the new position for dragbar, dock, content 
	calcDragPosition: function () {
		this.dockNowWidth =  this.$.colDock.getBounds().width;
	},
	//* @private methods for controls.
	adjustColumnPosition: function () {
		// override css styles and update new control column positon with specified width.
		var p_dock = this.$.colDock.getBounds(),
			p_content = this.$.colmain.getBounds(),
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

		this.$.colContent.applyStyle("min-height", maxHeight+"px");
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
		var move = this.calcKnobPosition(inEvent); 
		this.updatePosition(move);
	},
	calcKnobPosition: function(inEvent) {
		 var move = {
		 	direction: inEvent.dx > 0 ? "right":"left",
		 	distance: Math.abs(inEvent.dx)
		 };
		 return move;
	},
	updatePosition: function(inMove) {
		if (inMove.direction == "left") {
			var dragMoveLeft =  (this.dockNowWidth-inMove.distance);
			if (dragMoveLeft > this.dockMinWidth) { 
				this.$.dragbar.applyStyle("left", -dragMoveLeft+"px");
				this.$.colDock.applyStyle("width", dragMoveLeft+"px");
				this.$.colDock.applyStyle("left", -dragMoveLeft+"px");
				this.$.containerDock.applyStyle("left", dragMoveLeft+"px");
			}
		} else {
			var dragMoveRight = (this.dockNowWidth+inMove.distance);
			if(dragMoveRight< this.dockMaxWidth) {
				this.$.dragbar.applyStyle("left", -dragMoveRight+"px");
				this.$.colDock.applyStyle("width", dragMoveRight+"px");
				this.$.colDock.applyStyle("left", -dragMoveRight+"px");
				this.$.containerDock.applyStyle("left", dragMoveRight+"px");
			}
		}
		// re-adjust columns position.
		this.adjustColumnPosition();
	},
	dragfinish: function(inSender, inEvent) {
		if (this.dragging) {
			this.dragging = false;
			inEvent.preventTap();
			this.calcDragPosition();
		}

	}
});