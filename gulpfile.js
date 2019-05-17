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

const pkgName = pkg.name.split('/');
const packageName = pkgName[pkgName.length - 1];
const files = {
	sass: path.resolve(__dirname, 'src/sass/index.sass'),
	js: path.resolve(__dirname, 'src/js/index.js'),
};
const dirs = {
	sass: path.resolve(__dirname, 'src/sass'),
	dist: {
		css: path.resolve(__dirname, 'dist/css'),
		js: path.resolve(__dirname, 'dist/js/')
	},
	docs: {
		lib: path.resolve(__dirname, 'docs/lib/')
	}
};

gulp.task('css', () => {
	if (fs.existsSync(files.sass)) {
		return gulp.src(['node_modules/bulma/sass/utilities/_all.sass'].concat([files.sass]))
			.pipe(concat(packageName + '.sass'))
			.pipe(sass({
				style: 'compressed',
				trace: true,
				loadPath: [dirs.sass],
				includePaths: ['node_modules', 'node_modules/bulma/sass/utilities/']
			}))
			.pipe(concat(packageName + '.min.css'))
			.pipe(postcss([autoprefixer({
				browsers: pkg.broswers
			})]))
			.pipe(cleancss())
			.pipe(gulp.dest(dirs.dist.css))
			.pipe(browserSync.reload({
				stream: true
			}));
	} else {
		log(colors.red('[Error]'), 'No Sass input file found');
		return gulp.src('.').pipe(nop());
	}
});

gulp.task('js', () => {
	if (fs.existsSync(files.js)) {
		return gulp.src(files.js)
			.pipe(webpackStream(webpackConfig), webpack)
			.pipe(gulp.dest(dirs.dist.js))
			.pipe(gulp.dest(dirs.docs.lib));
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

gulp.task('default', gulp.series('css', 'js'), done => {
	done();
});