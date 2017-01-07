'use strict'
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var htmlhint = require("gulp-htmlhint");
var csslint = require("gulp-csslint");

/***********************************************************
lint
************************************************************/
gulp.task("lint:html", function() {
    gulp.src(path.html)
        .pipe(plumber({
            errorHandler: notify.onError('HTMLでError出てまっせ: <%= error.message %>')
        }))
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter());
});

gulp.task("lint:css", function() {
    gulp.src(path.css)
        .pipe(plumber({
            errorHandler: notify.onError('CSSでError出てまっせ: <%= error.message %>')
        }))
        .pipe(csslint('.csslintrc'))
        .pipe(csslint.formatter());
});

gulp.task("lint:js", function() {
    return gulp.src(path.js)
        .pipe(plumber({
            errorHandler: notify.onError('JSでError出てまっせ: <%= error.message %>')
        }))
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(plumber.stop());
});