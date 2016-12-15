/* jshint node: true */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync'),
    reload = browsersync.reload,
    csscomb = require('gulp-csscomb'),
    minifycss = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    gzip = require('gulp-gzip'),
    rename = require('gulp-rename');

gulp.task('styles', function() {
    gulp.src(['sass/main.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rename({
            basename: 'dreamgrove-faq'
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css/'))
});

gulp.task('serve', ['styles'], function() {
    browsersync({
        logPrefix: "Dreamgrove FAQ",
        port: 3000
    });
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('index.html').on('change', reload);
    gulp.watch('assets/**/*.js').on('change', reload);
});

gulp.task('default', ['serve']);