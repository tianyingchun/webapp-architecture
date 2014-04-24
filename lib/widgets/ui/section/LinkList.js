enyo.kind({
	name: "widgets.section.LinkList",
	kind: "widgets.section.Abstract",
	published: {
		rows: 1
	},
	handlers: {
		oninput:"inputValueChanged"
	},
	preInit: function () {
		// this.model = "view";
		this.source = enyo.isArray(this.source)? this.source : [];

		// supported icon list.
		this.linkIcons = [
			{id:"https", content:"https"},
			{id:"http", content:"https"}
		];
		// for testing purpose
		this.source = [
			{href:"http://www.1qianbao.com", target:"_blank", icon: "", text:"alipay.micropay.order.direct.pay", title:"title", description:"单笔直接支付"},
			{href:"http://www.1qianbao.com", target:"_blank", icon: "", text:"alipay.micropay.order.freezepayurl.get", title:"title", description:"查询冻结金支付地址"},
			{href:"http://www.1qianbao.com", target:"_blank", icon: "", text:"alipay.micropay.order.confirmpayurl.get", title:"title", description:"查询单笔有密支付地址"},
			{href:"http://www.1qianbao.com", target:"_blank", icon: "", text:"alipay.micropay.order.get", title:"title", description:"查询冻结订单详情"}
		];
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

		}	
	},
	_isEditListRow: function ($input) {
		return true;
	},
	_updateLinkData: function ($input) {

	},
	_drawLinks: function () {
		var _linkItems = [];
		for (var i = 0; i < this.source.length; i++) {
			var item = this.source[i];
			_linkItems.push (this._drawLink(item));
		};
		var linksKind = {
			components: _linkItems,
			classes:"section-linklist"
		};
		return linksKind;
	},
	_drawLink: function (linkItem) {
		var item = null;
		if (this.model =="view") {
			item ={ classes:"link-item", components: [
				{kind: "enyo.Anchor",attributes:{target:linkItem["target"]}, href: linkItem["href"], title: linkItem["title"], content: linkItem["text"]}
			]};
			var desc = linkItem["description"];
			if(desc) {
				item.components.push({
					content:desc,
					tag:"span",
					classes:"desc"
				});
			}
		} else {
			item ={ classes:"link-item", components: [
				{kind: "enyo.Anchor",attributes:{target:linkItem["target"]}, href: linkItem["href"], title: linkItem["title"], content: linkItem["text"]}
			]};
			var desc = linkItem["description"];
			if(desc) {
				item.components.push({
					content:desc,
					tag:"span",
					classes:"desc"
				});
			}
		}
		return item;
	}
});