enyo.kind({
	name:"Master.views.controls.HeaderLink",
	classes:"navbar",
	components: [
		{ tag:"ul", classes:"navbar-inner", components: [
				{ tag:"li", classes:"item text", content:"欢迎使用壹钱包！"},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"http://dev.1qianbao.com/blog/" }, content:"官方博客"}
				]},
				{ tag:"li", classes:"item seperator"},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"http://dev.1qianbao.com/forum/" }, content:"官方论坛"}
				]},
				{ tag:"li", classes:"item seperator"},
				{ tag:"li", classes:"item",components: [
					{ tag: "a", attributes:{ target:"_blank", href:"http://www.1qianbao.com/" }, content:"壹钱包官网"}
				]}
		]}
	]
});