'use strict'
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var filter = require('gulp-filter');

var version = require('../config').version;

function cssBuild(device, versions) {
  return gulp.src('./src/css/' + device + '/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(filter('**/*.css'))
    .pipe(autoprefixer({
      browsers: versions
    }))
    .pipe(csscomb())
    .pipe(rename({
      suffix: '_' + device + '_' + version
    }))
    .pipe(csso())
    .pipe(gulp.dest('./server/public'));
}

gulp.task('css-build:sp', function() {
  return cssBuild('sp', ['ios >= 6', 'android >= 2.3']);
});

gulp.task('css-build:pc', function() {
  return cssBuild('pc', ['last 2 versions', 'ie >= 8']);
});

