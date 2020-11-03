let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs');

let asyncCss = `<script>
function loadStyle(url){
	let link = document.createElement('link');
	link.href = url;
	link.rel = 'stylesheet';
	document.body.appendChild(link);
}
loadStyle('css/main.css');
loadStyle('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,400&display=swap');
</script>`;

app.use('/css', express.static(path.resolve(__dirname, './dist/css')));
app.use('/js', express.static(path.resolve(__dirname, './dist/js')));
app.use('/img', express.static(path.resolve(__dirname, './dist/img')));
app.use('/favicon.ico', express.static(path.resolve(__dirname, './dist/favicon.ico')));

let pages = ['index', 'gallery'];

app.use('*', function(req, res){
	let url = ('page' in req.query) ? req.query.page : 'index';
	// todo: check by regexp
	let pagePath = `./dist/${url}.html`;
	
	if(fs.existsSync(pagePath)){
		let criticalCSS = fs.readFileSync(`./dist/css/${url}-critical.css`).toString('UTF-8');
		let html = fs.readFileSync(pagePath).toString('UTF-8');
	
		if('nocrit' in req.query){
			html = html.replace(
				'<link rel="stylesheet" href="css/main.css">', 
				'<link rel="stylesheet" href="css/main.css">\
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,400&display=swap">'
			);
		}
		else{
			html = html.replace('<link rel="stylesheet" href="css/main.css">', `<style>${criticalCSS}</style>`);
			html = html.replace('<!--asyncCss-->', asyncCss);
		}
	
		res.end(html);
	}
	else{ 
		res.end('404');
	}
});

console.log('server started')
app.listen(3000);