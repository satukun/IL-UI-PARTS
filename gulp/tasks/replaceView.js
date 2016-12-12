'use strict'
var gulp = require('gulp');
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
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(rename(function (path) {
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
