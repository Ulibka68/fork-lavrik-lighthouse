const gulp = require('gulp');
const less = require('gulp-less');
const webp = require('gulp-webp');
const gcmq = require('gulp-group-css-media-queries');
const critical = require('critical');

let crPages = ['index', 'gallery'];
let crList = {
	'.btn': ['display', 'font-size', 'height', 'line-height', 'padding', 'text-align', 'border'],
}

function criticalCSS(done){
	crPages.forEach(async page => {
		await critical.generate({
			base: './dist/',
			src: `${page}.html`,
			css: [ 'css/main.css' ],
			target: {
				css: `css/${page}-critical.css`,
				//uncritical: `css/${page}-async.css`
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
	});
	
	done();
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

function images(){
	return gulp.src('./src/img/*')
				.pipe(gulp.dest('./dist/img'));
}

function imagesWebp(){
	return gulp.src('./src/img/*')
				.pipe(webp())
				.pipe(gulp.dest('./dist/img'));
}

gulp.task('html', html);
gulp.task('css', css);
gulp.task('critical', criticalCSS);
gulp.task('images', images);
gulp.task('webp', imagesWebp);

gulp.task('build', 
	gulp.series(
		gulp.parallel(html, css),
		criticalCSS
	)
);