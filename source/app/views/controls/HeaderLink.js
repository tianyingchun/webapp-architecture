enyo.kind({
	name:"Master.views.controls.HeaderLink",
	classes:"navbar",
	mixins: [
		"Master.ClassSupport"
	],
	components: [
		{ tag:"ul", classes:"navbar-inner", components: [
				{ tag:"li", classes:"item text", content:"欢迎使用在线文档中心！"},
				// { tag:"li", classes:"item",components: [
				// 	{ tag: "span", action:"login", content:"登陆"},
				// 	{ tag: "span", content:"-"},
				// 	{ tag: "span", action:"register", content:"注册"}
				// ]},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"http://www.clothesgate.com/" }, content:"CG 主站"}
				]},
				{ tag:"li", classes:"item seperator"},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"http://mens.clothesgate.com" }, content:"CG Mens"}
				]},
				{ tag:"li", classes:"item seperator"},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"http://kids.clothesgate.com" }, content:"CG Kids"}
				]}
		]}
	]
});