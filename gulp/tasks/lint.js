'use strict'
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var eslint = require('gulp-eslint');
var htmlhint = require("gulp-htmlhint");
var csslint = require("gulp-csslint");
var sassLint = require("gulp-sass-lint");
var notify = require("gulp-notify");



// --------------------------------------------------------
var f = require('../path');
f = f.func();
// --------------------------------------------------------

function lints(device, type) {
    if (device === 'pc') {
        if (type === 'html') {
            gulp.src(f.path.html)
                .pipe(plumber({
                    errorHandler: notify.onError('HTMLでError出てまっせ: <%= error.message %>')
                }))
                .pipe(htmlhint('.htmlhintrc'))
                .pipe(htmlhint.reporter());
        } else if (type === 'css') {
            gulp.src(f.path.css)
                .pipe(plumber({
                    errorHandler: notify.onError('CSSでError出てまっせ: <%= error.message %>')
                }))
                .pipe(csslint('.csslintrc'))
                .pipe(csslint.formatter());
        } else {
            return gulp.src(f.path.js)
                .pipe(plumber({
                    errorHandler: notify.onError('JSでError出てまっせ: <%= error.message %>')
                }))
                .pipe(eslint({ useEslintrc: true }))
                .pipe(eslint.format())
                .pipe(eslint.failAfterError())
                .pipe(plumber.stop());
        }
    }
}

gulp.task('lint-html:pc', function() {
    return lints('pc', 'html');
});

gulp.task('lint-css:pc', function() {
    return lints('pc', 'css');
});

gulp.task('lint-js:pc', function() {
    return lints('pc', 'js');
});