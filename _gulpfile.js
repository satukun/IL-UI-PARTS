'use strict'
require('babel-core/register')
var gulp = require('gulp');
var sequence = require('gulp-sequence');
var requireDir = require('require-dir');
requireDir('./gulp/tasks', {recurse: true});

gulp.task('eb-deploy', function(callback) {
  return sequence(
    ['eslint'],
    ['replace:pc','replace:sp'],
    ['pre-test'],
    ['test-no-env-setting'],
    ['test'],
    ['webpack', 'sprite:pc', 'sprite:sp', 'img:pc', 'img:sp', 'robots'],
    ['css-build:pc', 'css-build:sp'],
    'zip',
    ['s3upload', 'staticfileupload'],
    'beanstalkCreateApplicationVersion',
    'beanstalkupdateEnvironment',
    callback
  );
});

gulp.task('prepare', function(callback) {
  return sequence(
    ['eslint'],
    ['replace:pc','replace:sp'],
    // ['pre-test'],
    // ['test-no-env-setting'],
    // ['test'],
    ['webpack', 'sprite:pc', 'sprite:sp', 'img:pc', 'img:sp', 'robots'],
    ['css-build:pc', 'css-build:sp'],
    callback
  );
});

gulp.task('default', function(callback) {
  return sequence(
    'prepare',
    'start',
    callback
  );
});
