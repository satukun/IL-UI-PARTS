'use strict'
var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('eslint', function () {
  return gulp.src(['**/*.js','!node_modules/**','!**/coverage/**','!server/public/**'])
  .pipe(eslint({useEslintrc: true}))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});