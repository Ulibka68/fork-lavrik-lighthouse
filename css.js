const critical = require('critical');

let crList = {
	'.btn': ['display', 'font-size', 'height', 'line-height', 'padding', 'text-align', 'border'],
}

critical.generate({
	base: './',
	src: 'index.html',
	css: [ 'css/what.css' ],
	target: {
		css: 'css/critical.css',
		uncritical: 'css/async.css'
	},
	width: 1280,
	height: 480,
	include: [
		'.footer__0b1d532'
	],
	ignore: {
		rule: [
			/hljs-/
		],
		decl(node, value){
			let { selector } = node.parent; 
					
			if(!(selector in crList)){
				return false;
			}
			
			return !crList[selector].includes(node.prop);
		}
	}
});