enyo.kind({
	name:"Master.views.controls.HeaderMenu",
	classes:"menubar",
	components: [
		{ classes: "menubar-inner", components: [
			{classes:"logo", components: [
				{tag:"a", attributes: { href:"#home"}, content:"开放平台"}
			]},
			{classes:"menu-item", tag:"ul", components: [
				{tag:"li", classes:"item", components: [
					{tag:"a", attributes: { href:"https://1qianbao.com/merchant/",target:"_blank"}, content:"商户签约"}
				]},
				{tag:"li", classes:"item", components: [
					{tag:"a", attributes: { href:"http://dev.1qianbao.com/forum/",target:"_blank"}, content:"论坛"}
				]}
			]}
		]}
	]
});