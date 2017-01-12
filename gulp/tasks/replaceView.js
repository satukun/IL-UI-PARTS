'use strict'
var gulp = require('gulp');
var fs = require("fs");
var ejs = require("gulp-ejs");
var changed = require('gulp-changed');
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var prettify = require("gulp-html-prettify");
var browser = require("browser-sync");
var replace = require('gulp-replace');
var cache = require('gulp-cached');
var through = require('through2');

// --------------------------------------------------------
var version = require('../config').version;
var f = require('../path');
f = f.func();
// --------------------------------------------------------

// var mode = process.env.ENV_MODE || 'development';
// var gulp_config_name = '../gulp_' + mode;
// var config = require(gulp_config_name);

function replaceEjs(device) {
    if (device === 'pc') {
        return gulp.src(f.path.ejs)
            // .pipe(cache('replace:pc'))
            .pipe(replace('.js', '.js?' + version))
            .pipe(replace('.css', '.css?' + version))
            .pipe(changed(f.dir.src + '/deploy/' + f.work + '/'))
            .pipe(plumber({
                errorHandler: notify.onError('ejsでError出てまっせ: <%= error.message %>')
            }))
            .pipe(ejs({
                site: JSON.parse(fs.readFileSync(f.develop.data + 'site.json'))
            }, { "ext": ".html" }))
            .pipe(prettify({ indent_char: ' ', indent_size: 2 }))
            .pipe(gulp.dest(f.dir.src + '/deploy/' + f.work + '/'))
            .pipe(browser.reload({
                stream: true
            }))
    }
}

gulp.task('replace:pc', function() {
    return replaceEjs('pc');
});