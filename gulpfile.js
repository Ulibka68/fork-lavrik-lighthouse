const gulp = require('gulp');
const less = require('gulp-less');
const gcmq = require('gulp-group-css-media-queries');
const critical = require('critical');

let crList = {
	'.btn': ['display', 'font-size', 'height', 'line-height', 'padding', 'text-align', 'border'],
}

function criticalCSS(done){
	return critical.generate({
		base: './dist/',
		src: 'index.html',
		css: [ 'css/main.css' ],
		target: {
			css: 'css/critical.css',
			uncritical: 'css/async.css'
		},
		width: 1280,
		height: 480,
		include: [
			'.footer'
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

	//done();
}

function html(){
	return gulp.src('./src/*.html')
				.pipe(gulp.dest('./dist'));
}

function css(){
	return gulp.src('./src/css/main.less')
				.pipe(less())
				.pipe(gcmq())
				.pipe(gulp.dest('./dist/css'));
}

gulp.task('html', html);
gulp.task('css', css);
gulp.task('critical', criticalCSS);

gulp.task('build', 
	gulp.series(
		gulp.parallel(html, css),
		criticalCSS
	)
);