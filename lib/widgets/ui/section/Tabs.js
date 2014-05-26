enyo.kind({
	name: "widgets.section.Tabs",
	kind: "widgets.section.Abstract",
	classes:"widget-section-tabs",
	handlers:{
		onTabIndexChanged:"tabIndexChangedHandler",
		oninput:"inputValueChanged"
	},
	published: {
		itemCount: 4,
		selectedIndex: 0
	},
	//*@override
	preInit: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// for testing purpose.
			// this.model = "edit";

			this.source = enyo.isArray(this.source) ? this.source: [
				 {header: "TabHeader 1", content:"TabContent1"},
				 {header: "TabHeader 2", content:"TabContent2"},
				 {header: "TabHeader 3", content:"TabContent3"},
				 {header: "TabHeader 4", content:"TabContent4"}
			];

			this.itemCount = this.source.length;
		};
	}),
	inputValueChanged: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		// ignore header input value change
		if ($originator.scope == "ignore") {
			return true;
		};
		if ($originator.action == "tabitems") {
			var val = $originator.getValue(); 
			this.set("itemCount", val||1);
		}
		return true;
	},
	itemCountChanged: function () {
		// first save tabs data.
		this._saveTabsData();
		// second update tabs ui.
		this._drawTabs();
	},
	//*@protected override Abstract class.
	drawInterface: function () {
		this.placeCustomizedHeaderControls([
			{tag: "span", content: "Items Counts: ", classes: "tabs"},
			{name:"inputTabItems", action:"tabitems", kind:"onyx.Input", classes:"tabs", type:"number", value: this.itemCount}
		]);
		this._drawTabs();
	},
	_saveTabsData: function() {
		var newSource = this.getSectionJSONResult();
		this.selectedIndex = newSource.selectedIndex;
		this.source = newSource.source;
		this.zLog("newSource", this.source);
	},	
	_drawTabs: function () {
		this.placeClientControl({
			name:"tabsSection",
			kind:"widgets.section.Tabs.Control",
			model: this.model,
			source: this.source,
			selectedIndex: this.selectedIndex
		});
	},
	//*@public override exist section  json result.
	getSectionJSONResult: enyo.inherit(function (sup) {
		return function () {
			var result = sup.apply(this, arguments);
			var tabsResult  = this.getTabsResult();
			result.source = tabsResult.source;
			result.selectedIndex = tabsResult.selectedIndex;
			this.zLog(result);
			return result;
		};
	}),
	/**
	 * *@ public
	 * only for edit model.
	 * 
	 * @return {array} table source result data [ [1,2],[1,2] ] 
	 */
	getTabsResult: function () {
		var $tabs = this.fetchClientControl("tabsSection");
		var nowTabItemCount = $tabs.getTabItemsCount();
		var newItemCount = this.get("itemCount");
		// get new tab source.
		var source = $tabs.getTabsNewSource();
		if (nowTabItemCount<newItemCount) {
			var diff = newItemCount- nowTabItemCount;
			var  _new = [];
			for (var i = 0; i < diff; i++) {
				var _index = (nowTabItemCount+i+1);
				_new.push({header: "TabHeader "+_index, content:"TabContent"+_index});
			};
			source = source.concat(_new);
		} else {
			source.splice(newItemCount);
			// remove unused tab items.
		}
		// get current selected index.
		var selectedIndex = $tabs.getSelectedIndex();
		// make sure the tabitem index always exist.
		if(!source[selectedIndex]) {
			selectedIndex = 0;
		}
		return {
			source: source,
			selectedIndex: selectedIndex
		};
 	},
 	tabIndexChangedHandler: function(inSender, inEvent) {
 		this.viewChangedBubble();
 		return true;
 	}
});
// private control
enyo.kind({
	name:"widgets.section.Tabs.Control",
	mixins: [
		"Master.ClassSupport"
	],
	published: {
		source: [], //[{header:"", content:'', displayOrder: 0}]
		selectedIndex: 0,
		headerClasses: "btn btn-default",
		contentClasses: "content-item",
		model: "view",
	},
	events:{
		onTabIndexChanged:""
	},
	components: [
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{name:"header", classes:"header-container btn-group"},
		{name:"content", classes:"tab-content"}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.currentIndex = this.selectedIndex;
			this.sourceChanged();
		};
	}),
	sourceChanged: function() {
		this._drawTabs();
		this.highLightDefaultItem();
	},
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// only for edit model
			if(this.model == "edit") {
				var $contentControls = this.$.content.getControls();
				for (var i = 0; i < $contentControls.length; i++) {
					var $content = $contentControls[i];
					if ($content.kindName == "Master.TextEditor") {
						$content.markItUp();
						var _content = this.source[i].content || "";
						$content.setEditorContent(_content);
					}
				};
			}
		};
	}),
	_drawTabs: function () {
		var headerComponents = [], contentComponents =[];
		for (var i = 0; i < this.source.length; i++) {
			var item = this.source[i];
			headerComponents.push(this._drawHeaderItem(item, i));
			contentComponents.push(this._drawContentItem(item, i));
		};
		this.$.header.destroyClientControls();
		this.$.header.createClientComponents(headerComponents);
		this.$.content.destroyClientControls();
		this.$.content.createClientComponents(contentComponents);
		this.render();
	},
	_drawHeaderItem: function (item, index) {
		var classes = [];
		if(this.selectedIndex == index) {
			classes.push("active");
		}
		classes.push(this.headerClasses);
		var kind = {
			classes: classes.join(" "),
			itemIndex: index,
			name : "tab-header-"+index,
			ontap:"tabItemClick"
		};
		if(this.model == "edit") {
			kind.kind = "enyo.Input";
			kind.type = "text";
			kind.value = item.header;
		} else {
			kind.kind = "enyo.Button";
			kind.content = item.header;
		}
		return kind;
	},
	_drawContentItem: function (item, index) {
		var classes = [];
		if(this.selectedIndex == index) {
			classes.push("active");
		}
		classes.push(this.contentClasses);

		var kind = {
			classes: classes.join(" "),
			itemIndex: index,
			name : "tab-content-"+index,
			allowHtml: true,
		};
		if(this.model == "edit") {
			kind.kind = "Master.TextEditor"
		} else {
			// for view model.
			kind.content = this.transformCodeSnippetByDom(item.content);
		}
		return kind;
	},
	tabItemClick: function(inSender, inEvent) {
		var $originator = inEvent.originator;
		var itemIndex = $originator.itemIndex;
		this.setActiveIndex(itemIndex);
		return true;
	},
	//*@public get new edited tab source.
	getTabsNewSource: function () {
		var newSource = [];
		if(this.model =="edit") {
			var tabItemCount  = this.getTabItemsCount();
			var $contentControls = this.$.content.getControls();
			var $headerControls = this.$.header.getControls();

			for (var i = 0; i < tabItemCount; i++) {
				 var headerTxt = $headerControls[i].getValue();
				 var contentTxt = $contentControls[i].getEditorContent();
				 newSource.push({
				 	header: headerTxt,
				 	content: contentTxt
				 });
			};
		}
		return newSource;
	},
	//*@private.
	highLightDefaultItem: function (itemIndex) {
		itemIndex = itemIndex || this.selectedIndex;
		var $controls = this.$.content.getControls();
		var $selectedItem = $controls[itemIndex];
		if ($selectedItem) {
			this.$.selection.select($selectedItem.id, $selectedItem);
		} else {
			this.zError("can't find content item index: `"+itemIndex+"` in section tabs.control widget!");
		}
	},
	//*@public 
	setActiveIndex: function (index) {
		this.currentIndex = index;
		var $content = this.$["tab-content-"+index];
		if ($content) {
			this.$.selection.select($content.id, $content); 
		} else {
			this.zError("can't find content item index: `"+index+"` in section tabs.control widget!");
		}
		this.doTabIndexChanged(index);
	},
	//*@public 
	getTabItemsCount: function () {
		return this.source.length;
	},
	getSelectedIndex: function () {
		return this.currentIndex;
	},
	select: function(inSender, inEvent) {
		var node = inEvent.data;
		var itemIndex = node.itemIndex;
		var $headerItem = this.$["tab-header-"+itemIndex];
		if ($headerItem) {
			$headerItem.addClass("active");
		}
		if (node) {
			node.addClass("active");	
		} 
		return true;
	},
	deselect: function(inSender, inEvent) {
		var node = inEvent.data;
		var itemIndex = node.itemIndex;
		var $headerItem = this.$["tab-header-"+itemIndex];
		if ($headerItem) {
			$headerItem.removeClass("active");
		}
		if (node) {
			node.removeClass("active");
		}
		return true;
	},
	transformCodeSnippetByDom: function (htmlContent) {
		if(hljs) {
			var codeBlock = document.createElement("div");
			// escape & symbol 
			codeBlock.innerHTML = utility.htmlEscapeAMP(htmlContent);
			var $allCodeBlock = codeBlock.getElementsByTagName("pre");
			for (var i = 0; i < $allCodeBlock.length; i++) {
				var $code = $allCodeBlock[i].firstChild;
				if ($code) {
					var _innerHtml = $code.innerHTML;
					$code.innerHTML = utility.htmlEncode(_innerHtml); 
				}
				hljs.highlightBlock($code);
			};
			return codeBlock.innerHTML;
		} else {
			return htmlContent;
		}
	}
})