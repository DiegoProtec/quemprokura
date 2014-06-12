'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var prod = 'prod/',
    dev = 'dev/';

//-----------------------------------Minifica e valida JS
gulp.task('scripts', ['jshint'], function() {
  gulp.src(dev+'js/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest(prod+'js/'));
});

gulp.task('jshint', function () {
    return gulp.src(dev+'js/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
});

//-----------------------------------Processa SASS e minifica CSS
gulp.task('styles', function () {
    return gulp.src('dev/stylesheets/css/main.scss')
        .pipe($.compass({
            .pipe(compass({
                css: dev+'stylesheets/css',
                sass: dev+'stylesheets/sass',
                image: dev+'img'
            }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(outdep+'stylesheets/css/'));
});

//-----------------------------------Minifica imagens
gulp.task('images', function () {
    return gulp.src(dev+'img/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(prod+'img/'));
});

//-----------------------------------Gera HTML com .JADE, valida e minifica HTML
gulp.task('jadehtml',['clean', 'validahtml','minihtml'], function() {
    gulp.src(dev+'jade/*.jade')
    .pipe($.jade({
        pretty: true
    }))
    .pipe(gulp.dest(dev));
});

gulp.task('validahtml', function () {
    gulp.src(dev'*.html')
    .pipe($.w3cjs());
});

gulp.task('minihtml', function() {
    var minifyHTML = require('gulp-minify-html')
    var opts = {conditionals:true,spare:true};
    gulp.src(dev+'*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(prod));
});

gulp.task('clean', function () {
    return gulp.src([dev+'**/*.html', prod+'**/*.html'], { read: false }).pipe($.clean());
});

//-----------------------------------Criação do servidor e watch
gulp.task('connect', ({

}));

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();
    gulp.watch([
        dev+'*.html',
        dev+'stylesheets/**/*.css',
        dev+'js/**/*.js',
        dev+'img/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch(dev+'js/**/*.js', ['scripts']);
    gulp.watch(dev+'stylesheets/sass/*.scss', ['styles']);
    gulp.watch(dev+'img/**/*', ['images']);
    gulp.watch(dev+'jade/**/*.jade', ['jadehtml']);    
});

gulp.task('build', ['scripts', 'styles', 'images', 'jadehtml']);

gulp.task('default', ['build'], function () {
    gulp.start('server');
});

gulp.task('server', ['connect', 'styles'], function () {
    require('opn')('http://localhost:9000');
});