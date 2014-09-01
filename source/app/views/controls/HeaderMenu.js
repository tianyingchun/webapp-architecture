enyo.kind({
	name:"Master.views.controls.HeaderMenu",
	classes:"menubar",
	components: [
		{ classes: "menubar-inner", components: [
			{classes:"logo", components: [
				{tag:"a", attributes: { href:"#home"}, content:"CG 文档中心"}
			]},
			{classes:"menu-item", tag:"ul", components: [
				{tag:"li", classes:"item", components: [
					{tag:"a", attributes: { href:"https://www.clothesgate.com/",target:"_blank"}, content:"CG Womens"}
				]},
				{tag:"li", classes:"item", components: [
					{tag:"a", attributes: { href:"http://kids.clothesgate.com/",target:"_blank"}, content:"CG Kids"}
				]}
			]}
		]}
	]
});