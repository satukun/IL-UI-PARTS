'use strict'
var gulp = require('gulp');
var istanbul = require('gulp-babel-istanbul');
var env = require('gulp-env');
var mocha = require('gulp-mocha');

gulp.task('pre-test', function () {
  return gulp.src(['./common/**/*.js', '!./common/test/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test-no-env-setting', function (callback) {
  gulp.src(['./common/test/config/*.js'])
    .pipe(mocha())
    .once('end', () => {
      callback()
    });
});

gulp.task('test', function () {
  env({
    vars: {
      NODE_ENV: 'development',
      PORT: 3001
    }
  });
  return gulp.src(['./common/test/**/*.js'])
    .pipe(mocha({timeout: 5000}))
    .pipe(istanbul.writeReports({
      dir: './server/coverage'
    }))
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 95 } }))
});
