enyo.kind({
	name: "widgets.forms.SearchForm",
	classes: "search-form", 
	mixins: [
		"Master.ClassSupport"
	],
	components: [
		{ classes: "search-input", onkeypress:"searchEnterKey", name:"searchTxt", placeholder: Master.locale.get("SEARCH_HINT", "placeholder"), kind: "onyx.Input"},
		{ classes: "search-button", ontap:"goSearch", kind: "onyx.Button",content: Master.locale.get("SEARCH","button")},
		{ classes: "show-advanced-search",name:"showAdvancedSearch", ontap:"showSearchFilterPanel", content: Master.locale.get("REFINE_SEARCH","label")},
		{ classes: "search-filter", name:"searchfilter", components:[
			{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
			{ classes: "search-options radio", kind:"Group", hightlander:true, onActivate:"groupActivated", components: [
			 	{ classes: "option", content:"All", kind: "onyx.Checkbox", checked: true },
			 	{ classes: "option", content:"Theme", kind: "onyx.Checkbox"},
			 	{ classes: "option", content:"Modules", kind: "onyx.Checkbox"},
			 	{ classes: "option", content:"Documents", kind: "onyx.Checkbox"}
			]}
		]}
	],
	published: {
		collapsed: true,
		maxHeight: undefined,
        minHeight: undefined
	},
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// initalize the settings.
			this.initStyleBounds();
		}
	}),
	initStyleBounds: function () {
		var $collapsePanel = this.$.searchfilter;
		if (this.hasNode() && $collapsePanel.hasNode()) {
			var bounds =  $collapsePanel.getBounds();
            this.setMaxHeight(bounds.height);   
            // simple set min height equals 0.             
            this.setMinHeight(0);
            if (this.getCollapsed()) {
            	$collapsePanel.hide();
            }
        }
	},
	// hook enter key up event for search.
	searchEnterKey: function (inSender, inEvent) {
		if (inEvent.keyCode == KeyBoard.ENTER_KEY) {
			this.goSearch();
		}
	},
	// do search...
	goSearch: function (inSender, inEvent) {
		var searchTxt = this.$.searchTxt.getValue();
		this.zLog("searchTxt: ", searchTxt);
	},
	// display filter panel.
	showSearchFilterPanel: function (inSender, inEvent) {
		var collapsed = this.getCollapsed();
		if (collapsed) {
			this.showSearchFilter(inSender);
		} else {
			this.hideSearchFilter(inSender);
		}
	},
	showSearchFilter: function (inSender) {
		this.$.searchfilter.show();
		this.$.animator.play({
            startValue: this.getMinHeight(),
            endValue: this.getMaxHeight(),
            node: this.hasNode(),
            collapsed: false
        });
        this.$.showAdvancedSearch.addClass("advanced-search-shown");
        this.setCollapsed(false);
	},
	hideSearchFilter: function (inSender) {
		this.$.animator.play({
            startValue: this.getMaxHeight(),
            endValue: this.getMinHeight(),
            node: this.hasNode(),
            collapsed: true
        });
        this.$.showAdvancedSearch.removeClass("advanced-search-shown");
        this.setCollapsed(true);
	},
	animatorStep: function(inSender) {
        this.$.searchfilter.applyStyle("height", inSender.value + "px");
        return true;
    },
    animatorComplete: function(inSender, inEvent) {       
        if (inEvent.originator.collapsed) {
            // this.$.searchfilter.hide();
        }                
        return true;
    },
	groupActivated: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		if ($originator.getActive()){
			// var index = $originator.indexInContainer();
			var selectedTxt = $originator.getContent();
			this.zLog("selected: ", selectedTxt);
		}
		return true;
	}
});