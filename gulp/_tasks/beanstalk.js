'use strict'
var gulp = require('gulp');
var zip = require('gulp-zip');
var fs = require('fs');
var aws = require('aws-sdk');
var version = require('../config').version;
var archive = 'archive-' + version + '.zip'
var mode = process.env.ENV_MODE || 'development';
var gulp_config_name = '../gulp_' + mode;
var gulp_config = require(gulp_config_name);

gulp.task('zip', function () {
  return gulp.src(['./common/**', './server/**', './views/**', './package.json', './.ebextensions/' + mode + '_**'], {base: '.'})
  .pipe(zip(archive))
  .pipe(gulp.dest('dist'));
});

gulp.task('s3upload', function(){
  var config = JSON.parse(fs.readFileSync('./gulp/aws.json'));
  var s3 = require('gulp-s3-upload')(config);
  return gulp.src('./dist/' + archive)
  .pipe(s3({
    Bucket: gulp_config.s3_static_build_bucket //  Required
  }, {
    maxRetries: 5
  }));
});

gulp.task('staticfileupload', function(){
  var config = JSON.parse(fs.readFileSync('./gulp/aws_static.json'));
  var s3 = require('gulp-s3-upload')(config);
  return gulp.src(['./server/public/*' + version + '.js', './server/public/*' + version + '.css', './server/public/im*/*/*.png', './server/public/im*/*/sprite_' + version + '.png'])
  .pipe(s3({
    Bucket: gulp_config.s3_static_file_bucket, //  Required
    Metadata: {
      'Cache-Control': 'max-age=2592000'
    }
  }, {
    maxRetries: 5
  }));
});

gulp.task('beanstalkCreateApplicationVersion', function(callback){
  var awsCreds = JSON.parse(fs.readFileSync('./gulp/aws.json'));
  aws.config.credentials = awsCreds;
  aws.config.update({region: awsCreds.region});
  var ebParams = JSON.parse(fs.readFileSync('./gulp/ebParams.json'));
  Object.assign(ebParams.SourceBundle, {'S3Key':archive});
  Object.assign(ebParams, {'VersionLabel': version});
  var eb = new aws.ElasticBeanstalk();
  eb.createApplicationVersion(ebParams, function (err) {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });
});

gulp.task('beanstalkupdateEnvironment', function(){
  var awsCreds = JSON.parse(fs.readFileSync('./gulp/aws.json'));
  aws.config.credentials = awsCreds;
  aws.config.update({region: awsCreds.region});
  var ebEnvironment = JSON.parse(fs.readFileSync('./gulp/ebEnvironment.json'));
  Object.assign(ebEnvironment, {'VersionLabel': version});
  var eb = new aws.ElasticBeanstalk();
  eb.updateEnvironment(ebEnvironment, function (err) {
    if (err) {
      console.log(err);
    }
  });
});