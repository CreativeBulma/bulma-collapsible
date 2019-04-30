const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cleancss = require('gulp-clean-css');
const colors = require('ansi-colors');
const concat = require('gulp-concat');
const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');
const nop = require('gulp-nop');
const path = require('path');
const pkg = require('./package.json');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('css', () => {
	if (fs.existsSync('./src/sass/index.sass')) {
		return gulp.src(['node_modules/bulma/sass/utilities/_all.sass'].concat(['./src/sass/index.sass']))
			.pipe(concat(pkg.name + '.sass'))
			.pipe(sass({
				style: 'compressed',
				trace: true,
				loadPath: ['./src/sass'],
				includePaths: ['node_modules', 'node_modules/bulma/sass/utilities/']
			}))
			.pipe(concat(pkg.name + '.min.css'))
			.pipe(postcss([autoprefixer({
				browsers: pkg.broswers
			})]))
			.pipe(cleancss())
			.pipe(gulp.dest(path.resolve(__dirname, 'dist/css')))
			.pipe(browserSync.reload({
				stream: true
			}));
	} else {
		log(colors.red('[Error]'), 'No Sass input file found');
		return gulp.src('.').pipe(nop());
	}
});

gulp.task('js', () => {
	if (fs.existsSync('./src/js/index.js')) {
		return gulp.src('./src/js/index.js')
			.pipe(webpackStream(webpackConfig), webpack)
			.pipe(gulp.dest(path.resolve(__dirname, 'dist/js/')))
			.pipe(gulp.dest(path.resolve(__dirname, 'docs/lib/')));
	} else {
		log(colors.red('[Error]'), 'No JavaScript input file found');
		return gulp.src('.').pipe(nop());
	}
});

gulp.task('browserSync', () => {
	browserSync.init({
		server: {
			baseDir: 'demo'
		},
	});
});

gulp.task('watch', gulp.series('browserSync', 'css', 'js'), () => {
	gulp.watch('./src/sass/**/*.sass', ['css']);
	gulp.watch('./src/js/**/*.js', ['js']);

	gulp.watch('demo/assets/js/**/*.js', browserSync.reload);
});

gulp.task('default', gulp.series('css', 'js', function (done) {
	done();
}));