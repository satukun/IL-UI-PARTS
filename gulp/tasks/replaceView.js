'use strict'
var gulp = require('gulp');
var ejs = require("gulp-ejs");
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var htmlmin = require('gulp-htmlmin');
var version = require('../config').version;
var mode = process.env.ENV_MODE || 'development';
var gulp_config_name = '../gulp_' + mode;
var config = require(gulp_config_name);

function replaceEct(device) {
    return gulp.src('./views/' + device + '/_*.ect')
        .pipe(replace('/bundle.js', config.hashtag_cdn_static_domain + 'bundle_' + device + '_' + version + '.js'))
        .pipe(replace('/hash.css', config.hashtag_cdn_static_domain + 'hash_' + device + '_' + version + '.css'))
        .pipe(replace('http://stat100.ameba.jp', config.ameba_stat_domain))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename(function(path) {
            path.basename = path.basename.replace(/_/g, '')
        }))
        .pipe(gulp.dest('./views/' + device));
}

gulp.task('replace:pc', function() {
    return replaceEct('pc');
});

gulp.task('replace:sp', function() {
    return replaceEct('sp');
});


gulp.task("ejs", function() {
    return gulp.src(path.ejs)
        .pipe(changed(dir.src + '/deploy/' + work + '/'))
        .pipe(plumber({
            errorHandler: notify.onError('ejsでError出てまっせ: <%= error.message %>')
        }))
        .pipe(ejs({
            site: JSON.parse(fs.readFileSync(develop.data + 'site.json'))
        }, { "ext": ".html" }))
        .pipe(prettify({ indent_char: ' ', indent_size: 2 }))
        .pipe(gulp.dest(dir.src + '/deploy/' + work + '/'))
        .pipe(browser.reload({
            stream: true
        }))
});