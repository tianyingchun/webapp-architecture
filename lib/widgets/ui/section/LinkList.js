enyo.kind({
	name: "widgets.section.LinkList",
	kind: "widgets.section.Abstract",
	published: {
		rows: 1
	},
	handlers: {
		oninput:"inputValueChanged",
		onDropdownItemChanged:"_dropdownItemChanged"
	},
	preInit: function () {
		// this.model = "view";
		this.source = enyo.isArray(this.source)? this.source : [];

		// supported icon list.
		this.linkIcons = [
			{id:"https", content:"https"},
			{id:"http", content:"http"}
		];
		this.linkTarget = [
			{id:"self", content:"_self"},
			{id:"blank", content:"_blank"}
		];
		// defined default link item data.
		this.defaultLinkItem = {href:"http://link href", target:"_self", linkIcon: "http", text:"link text",  description:"link description"};
		// for testing purpose
		this.source = [
			{href:"http://www.1qianbao.com", target:"_blank", linkIcon: "https", text:"alipay.micropay.order.direct.pay",  description:"单笔直接支付"},
			{href:"http://www.1qianbao.com", target:"_self", linkIcon: "http", text:"alipay.micropay.order.freezepayurl.get", description:"查询冻结金支付地址"},
			{href:"http://www.1qianbao.com", target:"_blank", linkIcon: "https", text:"alipay.micropay.order.confirmpayurl.get",  description:"查询单笔有密支付地址"},
			{href:"http://www.1qianbao.com", target:"_self", linkIcon: "http", text:"alipay.micropay.order.get", description:"查询冻结订单详情"}
		];

		if (this.source.length >0 ){
			this.set("rows", this.source.length);
		} 
	},
	drawInterface: function () {
		this.placeCustomizedHeaderControls([
			{tag: "span", content: "Counts:", classes: "link-list"},
			{name:"inputTextRow", action:"row", kind:"onyx.Input", classes:"link-list", type:"number", value: this.rows}
		]);
		this.placeClientControl(this._drawLinks()); 
	},
	inputValueChanged: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		if (this._isEditListRow($originator)) {
			// deal table edit cell
			this._updateLinkData($originator);
		} else {
			// redraw link item.
			var val = $originator.getValue(); 
			// must be number type.
			if(val && !isNaN(val)) {
				val = val > 0 ? val: 1;
				this.set("rows", val);
				var linksKind = this._drawLinks(this.get("rows"));
				this.placeClientControl(linksKind); 	
			}
		}	
		return true;
	},
	_isEditListRow: function ($input) {
		if(typeof $input.rowIndex!="undefined") {
			return true;
		}
		return false;
	},
	_updateLinkData: function ($input) {
		var newValue = $input.getValue();
		var rowIndex = $input.rowIndex;
		var dataKey  = $input.dataKey;
		if(!this.source[rowIndex]) {
			this.source[rowIndex] = enyo.clone(this.defaultLinkItem);
		}
		this.source[rowIndex][dataKey] = newValue;
	},
	_dropdownItemChanged: function (inSender, inEvent) {
		var $originator = inEvent.originator;
		var rowIndex = $originator.rowIndex;
		var dataKey  = $originator.dataKey;
		if(!this.source[rowIndex]) {
			this.source[rowIndex] = enyo.clone(this.defaultLinkItem);
		}
		this.source[rowIndex][dataKey] =  inEvent.content;
		return true;
	},
	_drawLinks: function (rowCount) {
		rowCount = rowCount || this.get("rows");
		var _linkItems = [];
		for (var i = 0; i < rowCount; i++) {
			var item = this.source[i];
			_linkItems.push (this._drawLink(i, item));
		};
		var linksKind = {
			name:"linkListSection",
			components: _linkItems,
			classes:"section-linklist"
		};
		return linksKind;
	},
	_drawLink: function (rowIndex, linkItem) {
		var item = null;
		var linkItem = linkItem || enyo.clone(this.defaultLinkItem);
		// get link item values		
		var iconClass = linkItem["linkIcon"] || "http",
			desc = linkItem["description"] || "",
			target = linkItem["target"]||"_self",
			href = linkItem["href"]||"http://",
			linkText = linkItem["text"]|| "link text";

		if (this.model =="view") {
			item ={ classes:"link-item", components: [
				{classes:"left", components:[
					{kind: "enyo.Anchor",attributes:{target:target}, href: href, content: linkText},
					{tag:"span", classes:iconClass}
				]},
				{classes:"right", components: [
					{tag:"span", classes:"desc", content: desc}
				]}
			]}; 
		} else {
			var _target = [];
			enyo.forEach(this.linkTarget, function (item) {
				var _new = {
					id: item.id+rowIndex,
					content: item.content
				};
				if(linkItem.target == item.content) {
					_new.selected = true;
				}
				_target.push(_new);
			});
			var _icons =[];
			enyo.forEach(this.linkIcons, function (item) {
				var _new = {
					id: item.id+rowIndex,
					content: item.content
				};
				if(linkItem.linkIcon == item.content) {
					_new.selected = true;
				}
				_icons.push(_new);
			});
			item ={ classes:"link-item", components: [
				{rowIndex: rowIndex, dataKey:"href", value:href, kind:"enyo.Input", placeholder:"http://link href", type:"text"},
				{rowIndex: rowIndex, dataKey:"text", value:linkText, kind:"enyo.Input", placeholder:"link text", type:"text"},
				{rowIndex: rowIndex, dataKey:"target", key:"id", kind:"widgets.forms.DropdownList", menuItemComponents:_target, defaultTitle:"--选择Target--"},
				{rowIndex: rowIndex, dataKey:"linkIcon", key:"id", kind:"widgets.forms.DropdownList", menuItemComponents:_icons, defaultTitle:"--选择ICON--"},
				{rowIndex: rowIndex, dataKey:"description",value:desc, kind:"enyo.Input",placeholder:"Link描述", type:"text"}
			]}; 
		}
		return item;
	},
	//*@public override exist section  json result.
	getSectionJSONResult: enyo.inherit(function (sup) {
		return function () {
			var result = sup.apply(this, arguments);
			result.source = this.getLinkListResult();
			this.zLog(result);
			return result;
		};
	}),
	/**
	 * *@ public
	 * only for edit model.
	 * @return {array} table source result data [ {href:"http://www.1qianbao.com", target:"_blank", linkIcon: "https", text:"alipay.micropay.order.direct.pay",  description:"单笔直接支付"} ] 
	 */
	getLinkListResult: function () {
		var $linkList = this.fetchClientControl("linkListSection");
		var $rows = $linkList.getControls();
		var source = enyo.cloneArray(this.source, 0);
		// remove other rows not includes in widget ui.
		source.splice($rows.length);
		return source;
	}
});