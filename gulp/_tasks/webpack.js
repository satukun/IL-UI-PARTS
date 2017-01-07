'use strict'
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var webpackConfig = require('../webpack.config.js');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var version = require('../config').version;

gulp.task('webpack', function() {
  return gulp.src('client/index.js')
  .pipe(webpack(webpackConfig))
  .pipe(uglify({mangle: false}))
  .pipe(rename({
    suffix: '_' + version
  }))
  .pipe(gulp.dest('./server/public'));
});
