enyo.kind({
	name:"Master.views.controls.HeaderMenu",
	classes:"menubar",
	components: [
		{ classes: "menubar-inner", components: [
			{classes:"logo", components: [
				{tag:"a", attributes: { href:"http://dev.1qianbao.com/",target:"_blank"}, content:"开放平台"}
			]},
			{classes:"menu-item", tag:"ul", components: [
				{tag:"li", classes:"item", components: [
					{tag:"a", attributes: { href:"http://dev.1qianbao.com/blog/",target:"_blank"}, content:"博客"}
				]},
				{tag:"li", classes:"item", components: [
					{tag:"a", attributes: { href:"http://dev.1qianbao.com/forum/",target:"_blank"}, content:"论坛"}
				]}
			]}
		]}
	]
});