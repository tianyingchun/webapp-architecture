// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
var myHtmlSettings = {
    nameSpace:       "html", // Useful to prevent multi-instances CSS conflict
    onShiftEnter:    {keepDefault:false, replaceWith:'<br />\n'},
    onCtrlEnter:     {keepDefault:false, openWith:'\n<p>', closeWith:'</p>\n'},
    onTab:           {keepDefault:false, openWith:'     '},
    markupSet:  [
        {name:'Heading 1', key:'1', openWith:'<h1(!( class="[![Class]!]")!)>', closeWith:'</h1>', placeHolder:'Your title here...' },
        {name:'Heading 2', key:'2', openWith:'<h2(!( class="[![Class]!]")!)>', closeWith:'</h2>', placeHolder:'Your title here...' },
        {name:'Heading 3', key:'3', openWith:'<h3(!( class="[![Class]!]")!)>', closeWith:'</h3>', placeHolder:'Your title here...' },
        {name:'Heading 4', key:'4', openWith:'<h4(!( class="[![Class]!]")!)>', closeWith:'</h4>', placeHolder:'Your title here...' },
        {name:'Heading 5', key:'5', openWith:'<h5(!( class="[![Class]!]")!)>', closeWith:'</h5>', placeHolder:'Your title here...' },
        {name:'Heading 6', key:'6', openWith:'<h6(!( class="[![Class]!]")!)>', closeWith:'</h6>', placeHolder:'Your title here...' },
        {name:'Paragraph', openWith:'<p(!( class="[![Class]!]")!)>', closeWith:'</p>'  },
        {separator:'---------------' },
        {name:'Javascript', key:'7', openWith:'<pre><code class="lang-javascript"(!( class="[![Class]!]")!)>', closeWith:'</code></pre>', placeHolder:'Your Javascript code here...' },
        {name:'C#', key:'8', openWith:'<pre><code class="lang-cs"(!( class="[![Class]!]")!)>', closeWith:'</code></pre>', placeHolder:'Your c# code here...' },
        {name:'Java', key:'9', openWith:'<pre><code class="lang-java"(!( class="[![Class]!]")!)>', closeWith:'</code></pre>', placeHolder:'Your java code here...' },
        {name:'Php', key:'0', openWith:'<pre><code class="lang-php"(!( class="[![Class]!]")!)>', closeWith:'</code></pre>', placeHolder:'Your php code here...' },

        {separator:'---------------' },
        {name:'Bold', key:'B', openWith:'<strong>', closeWith:'</strong>' },
        {name:'Italic', key:'I', openWith:'<em>', closeWith:'</em>'  },
        {name:'Stroke through', key:'S', openWith:'<del>', closeWith:'</del>' },
        {separator:'---------------' },
        {name:'Ul', openWith:'<ul>\n', closeWith:'</ul>\n' },
        {name:'Ol', openWith:'<ol>\n', closeWith:'</ol>\n' },
        {name:'Li', openWith:'<li>', closeWith:'</li>' },
        {separator:'---------------' },
        {name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
        {name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
        {separator:'---------------' },
        {name:'Clean', replaceWith:function(h) { return h.selection.replace(/<(.*?)>/g, "") } },
        {separator:'---------------' },
        {name:'Table', openWith:'<table>', closeWith:'</table>', placeHolder:"<tr><(!(td|!|th)!)></(!(td|!|th)!)></tr>",className:'table' },
        {name:'Tr', openWith:'<tr>', closeWith:'</tr>', placeHolder:"<(!(td|!|th)!)></(!(td|!|th)!)>", className:'table-col'},
        {name:'Td/Th', openWith:'<(!(td|!|th)!)>', closeWith:'</(!(td|!|th)!)>', className:'table-row' }
        // {name:'Preview', call:'preview', className:'preview' }
    ]
};