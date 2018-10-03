var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var wait = require('gulp-wait');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require("run-sequence");
var imagemin = require('gulp-imagemin');
var gutil = require('gulp-util');

//============================================
// BrowserSync task
//============================================
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

//============================================
// Reload
//============================================
gulp.task('reload', function() {
	browserSync.reload();
});

//============================================
// Clean task
//============================================
gulp.task('clean', function () {
	return gulp.src('./dist', {read: false})
		.pipe(clean());
});

//============================================
// ImageMin task
//============================================
gulp.task('imagemin', function () {
	return gulp.src('./src/images/**')
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('./dist/images/'));
});

//============================================
// FileInclude task
//============================================
gulp.task('fileinclude', function() {
	gulp.src(['./src/*.*'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
	.pipe(gulp.dest('./dist/'));
});

//============================================
// Sass task
//============================================
gulp.task('sass', () => {
	return gulp.src('./src/scss/main.scss')
		.pipe(wait(1000))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded' // nested | expanded | compact | compressed
		})).on("error", function (error) {
				gutil.log(
					gutil.colors.red("SASS compile error:"),
					error.message
				);
			})
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(rename('style.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

//============================================
// JS task
//============================================    
gulp.task('js', function() {
	return gulp.src(['./node_modules/jquery/dist/jquery.min.js', './src/js/scripts.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist/js/'))
		.pipe(browserSync.stream({
			match: '**/*.js'
		}))

});

//============================================
// Watch task
//============================================
gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch("src/**/*.{html, php}", ['fileinclude']).on('change', browserSync.reload);
	gulp.watch("src/images/**", ['imagemin']).on('change', browserSync.reload);
});


//============================================
// Default task
//============================================
gulp.task('default', runSequence('clean', 'imagemin', 'fileinclude', 'sass', 'js', 'browserSync', 'watch'));