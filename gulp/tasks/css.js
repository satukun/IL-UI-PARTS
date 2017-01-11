'use strict'
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var autoprefixer = require('gulp-autoprefixer');
var browser = require("browser-sync");
var notify = require("gulp-notify");
var csscomb = require('gulp-csscomb');

// --------------------------------------------------------
var f = require('../path');
f = f.func();
// --------------------------------------------------------

function cssBuild(device, versions) {
    if (device === 'pc') {
        return gulp.src(f.path.scss)
            .pipe(changed(f.dir.src + '/deploy/' + f.work))
            .pipe(plumber({
                errorHandler: notify.onError('SCSSでError出てまっせ: <%= error.message %>')
            }))
            .pipe(sass({ outputStyle: 'expanded' }))
            .pipe(autoprefixer({
                browsers: versions,
                cascade: false
            }))
            .pipe(csscomb())
            .pipe(gulp.dest(f.dir.src + '/deploy/' + f.work))
            .pipe(browser.reload({
                stream: true
            }))
    }
}
gulp.task('css-build:pc', function() {
    return cssBuild('pc', ['last 2 versions', 'ie >= 8']);
});