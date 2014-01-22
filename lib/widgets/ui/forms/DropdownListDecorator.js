enyo.kind({
	name: "widgets.forms.DropdownListDecorator",
	kind: "onyx.MenuDecorator",
	classes:"widgets-dropdownlist",
	mixins: [
		"Master.ClassSupport"
	],
	handlers:{
		onSelect: "itemSelected"
	},
	published:{
		defaultTitle: "--Please select item--",
		menuItemComponents:[],//{id, content}
		key: "id"// need to make sure the key has exist in menuItemComponents hash object.
	},
	components:[
		{kind: "Selection", name:"selection", onSelect: "select", onDeselect: "deselect"},
		{components:[
			{name:"title", classes:"drop-title", content:""},
			{name:"spinner",showing:false, classes:"drop-spinner"}
		]},
		{name:"menu", kind: "onyx.Menu", classes:"widgets-dropdownlist-menus", floating: true}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.defaultTitleChanged();
			this.menuItemComponentsChanged();
		};
	}),
	defaultTitleChanged: function () {
		this.$.title.setContent(this.defaultTitle);
	},
	//@private
	select: function(inSender, inEvent) {
		var originator = inEvent.originator;
		// cause of we have the same event name in this kind, onyx.Menu has onSelect event.
		// the selection control has also onSelect event.
		if(originator.kindName == "enyo.Selection"){
			var node = inEvent.data;
			if (node) {
				node.addClass("selected");	
			}
		}
		return true;
	},
	//@private
	deselect: function(inSender, inEvent) {
		var originator = inEvent.originator;
		if(originator.kindName == "enyo.Selection"){
			var node = inEvent.data;
			if (node) {
				node.removeClass("selected");
			}
		}
		return true;
	},
	//@public
	showSpinner: function () {
		this.$.spinner.show();
	},
	//@public
	hideSpinner: function (){
		this.$.spinner.hide();
	},
	//@public
	//@return null || item object
	getSelectedItem: function () {
		var _item = null;
		var _selectedItems = this.$.selection.getSelected();
		var selectedItem = _selectedItems[this._selectedMenuKey];
		if(selectedItem) {
			for (var i = 0; i < this.menuItemComponents.length; i++) {
				var item = this.menuItemComponents[i];
				if(item[this.key] ==selectedItem[this.key]){
					_item = item;
					break;
				}
			};
		}
		return _item;
	},
	menuItemComponentsChanged: function () {
		this.$.menu.destroyClientControls();
		this.$.menu.createClientComponents(this.menuItemComponents);
		this.$.menu.render();
		this.hideSpinner();
	},
	itemSelected: function (inSender, inEvent) {
		this.zLog("inEvent: ",inEvent);
		var originator = inEvent.originator;
		if(originator.kindName == "onyx.MenuItem") {
			this.$.title.setContent(originator.content);
			this._selectedMenuKey = originator.id;
			this.$.selection.select(this._selectedMenuKey, originator);
		}
		return true;
	}
});