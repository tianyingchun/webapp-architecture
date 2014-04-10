enyo.kind({
	name:"Master.views.controls.FooterLink",
	classes:"footer-inner", 
	components:[
		{ classes:"left-aside", components: [
			{ classes:"aside-link", tag: "ul", components: [
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://www.pingan.com/" }, content:"中国平安官网"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"https://www.1qianbao.com/" }, content:"壹钱包"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://one.pingan.com/" }, content:"一账通"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://www.eka.cn/" }, content:"壹卡会"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://bank.pingan.com/index.shtml" }, content:"平安银行"}
				]},
				{ tag:"li", classes:"link-item", components:[
					{tag:"a", attributes: { target:"_blank", href:"http://www.xsme.com/web/" }, content:"平安交易所"}
				]}
			]},
			{classes:"copyright", content:"壹钱包权所有 2013-2016 壹钱包版权所有 粤ICP备11100138号-5"}
		]}
	]
});