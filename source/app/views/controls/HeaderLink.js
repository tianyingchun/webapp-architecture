enyo.kind({
	name:"Master.views.controls.HeaderLink",
	classes:"navbar",
	mixins: [
		"Master.ClassSupport"
	],
	components: [
		{ tag:"ul", classes:"navbar-inner", components: [
				{ tag:"li", classes:"item text", content:"欢迎使用壹钱包文档中心！"},
				// { tag:"li", classes:"item",components: [
				// 	{ tag: "span", action:"login", content:"登陆"},
				// 	{ tag: "span", content:"-"},
				// 	{ tag: "span", action:"register", content:"注册"}
				// ]},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"https://1qianbao.com/merchant/" }, content:"商户门户"}
				]},
				{ tag:"li", classes:"item seperator"},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"http://merchant.1qianbao.com:1080/forum/forum.php" }, content:"官方论坛"}
				]},
				{ tag:"li", classes:"item seperator"},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"#home" }, content:"壹钱包官网"}
				]}
		]}
	]
});