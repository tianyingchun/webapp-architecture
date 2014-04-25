enyo.kind({
	name: "widgets.section.TextEditor",
	kind: "widgets.section.Abstract",
	preInit: function () {
		// for testing purpose.
		// this.model = "view";	
	},
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// only for edit model
			if(this.model == "edit") {
				this.$markItUp = this.fetchClientControl("textEditor");
				if(this.$markItUp) {
					this.$markItUp.markItUp();
					this.$markItUp.setEditorContent(this.getSource());
				}
			}
		};
	}),
	//*@protected override Abstract class.
	drawInterface: function () {
		var editorKind = {
			name:"textEditor", kind:"Master.TextEditor"
		};
		if (this.model == "view") {
			editorKind = {
				allowHtml: true,
				// for edit model.
				content: this._convertHtmlString(this.source)
			};
		}
		this.placeClientControl(editorKind); 
	},
	/**
	 * Convert html code into real code maybe transform code language.
	 */
	_convertHtmlString: function (htmlStr) {
		var test = /<pre[^>]*>((.|[\n\r])*)<\/pre>/im;
		htmlStr = htmlStr.replace(test, function (str) {
			// get lang
			var testCode = /<code([^<>]+)?>(.+?)<\/code>/ig;
			var lang = "javascript", codeValue="";

			//在ECMAScript3推荐使用函数方式，实现于JavaScript1.2.当replace方法执行的时候每次都会调用该函数，返回值作为替换的新值。
			//$1 -> 第一个参数为每次匹配的全文本（$&）
			//$2 -> 中间参数为子表达式匹配字符串，个数不限.( $i (i:1-99))
			str = str.replace(testCode, function ($1,$2,$3){
				// fetch language class
				if ($2) {
					lang = $2.replace(/(class\s*=\s*)|(\"|\')/ig,"").split("-")[1];
				}
				// fetch code.
				if($3) {
					codeValue = hljs.highlight(lang, $3).value;
				}
				return  "<code class=\"hljs "+lang+"\">"+codeValue+"</code>";
			}); 
			return str;
		});
		return htmlStr;
	},
	//*@public override exist section  json result.
	// * only for edit model.
	getSectionJSONResult: enyo.inherit(function (sup) {
		return function () {
			var result = sup.apply(this, arguments);
			result.source = this.$markItUp.getEditorContent();
			this.zLog(result);
			return result;
		};
	})
});