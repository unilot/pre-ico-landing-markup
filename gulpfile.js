var gulp = require('gulp'),
		pug = require('gulp-pug'),
		cssnano = require('gulp-cssnano'),
		connect = require('gulp-connect'),
		sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        csscomb = require('gulp-csscomb'),
        imagemin = require('gulp-imagemin'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        hash = require('gulp-hash-filename');

var nodeModulesDir = __dirname + '/node_modules';
var assetsDir = __dirname + '/assets';
var distDir = __dirname + '/docs';
var jsOrderedList = [
    nodeModulesDir + '/jquery/dist/jquery.min.js',
    assetsDir + '/js/vendor/slideout.js',
    assetsDir + '/js/vendor/jquery.rollingslider.js',
    assetsDir + '/js/vendor/jquery.plugin.min.js',
    nodeModulesDir + '/moment/min/moment.min.js',
    nodeModulesDir + '/moment-timezone/builds/moment-timezone-with-data.min.js',
    nodeModulesDir + '/jquery-countdown/dist/jquery.countdown.js',
    nodeModulesDir + '/parallax-js/dist/parallax.min.js',
    nodeModulesDir + '/swiper/dist/js/swiper.min.js',
    nodeModulesDir + '/bootstrap-validator/dist/validator.min.js',
    nodeModulesDir + '/js-cookie/src/js.cookie.js',
    assetsDir + '/js/form-validation.js',
    assetsDir + '/js/main.js',
    assetsDir + '/js/vendor/bootstrap.min.js'
];
var cssOrderedList = [
        assetsDir + '/css/vendor/flexboxgrid.min.css',
        nodeModulesDir + '/normalize.css/normalize.css',
        distDir + '/css/vendor/jquery.countdown.css',
        nodeModulesDir + '/swiper/dist/css/swiper.min.css',
        distDir + '/css/fonts.css',
        distDir + '/css/styles.css'
    ];

// Jade
gulp.task('pug', function buildHTML() {
  return gulp.src('./assets/pug/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./docs'))
  .pipe(connect.reload());
});


gulp.task('sass', function () {
  return gulp.src([
      './assets/css/fonts.sass',
      './assets/css/styles.sass'
  ])
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths,
      includePaths: require('node-neat').includePaths
    }).on('error', sass.logError))
    .pipe(csscomb())
    .pipe(gulp.dest('./docs/css'))
    .pipe(connect.reload());
});

gulp.task('css', ['sass'], function(){
    return gulp.src(cssOrderedList)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(distDir + '/css'))
        .pipe(connect.reload())
});

gulp.task('image', () =>
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./docs/img'))
);

// Minify JS
gulp.task('js', function() {
  	return gulp.src(jsOrderedList)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(__dirname + '/docs/js/'))
        .pipe(connect.reload());
});

// Watch
gulp.task('watch', function (){
	gulp.watch('./assets/**/*.js', ['js'])
	gulp.watch('./assets/pug/**/*.pug', ['pug']);
  gulp.watch('./assets/img/*', function(event) {
    gulp.run('image');
  });
});

gulp.task('sass:watch', function () {
  gulp.watch('./assets/**/*.sass', ['css']);
});

// Server
gulp.task('connect', function() {
  connect.server({
    root: 'docs',
    livereload: true,
    port: 8780
  });
});

gulp.task('js:prod', function() {
    return gulp.src(jsOrderedList)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(hash())
        .pipe(gulp.dest(__dirname + '/docs/js/'))
});

gulp.task('css:prod', ['sass'], function() {
    var vendorDir = __dirname + '/docs/css';

    return gulp.src(cssOrderedList)
        .pipe(concat('main.min.css'))
        .pipe(cssnano())
        .pipe(hash())
        .pipe(gulp.dest(__dirname + '/docs/css'))
});

gulp.task('default', ['pug', 'css', 'js', 'watch', 'sass:watch', 'connect', 'image']);